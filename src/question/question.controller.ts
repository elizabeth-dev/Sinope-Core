import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ReqUser } from '../shared/decorators/user.decorator';
import { UserEntity } from '../user/user.schema';
import { CreateQuestionReq } from './definitions/CreateQuestionReq.dto';
import { QuestionRes } from './definitions/QuestionRes.dto';
import { QuestionService } from './question.service';

@ApiTags('Question controller')
@Controller('questions')
export class QuestionController {
	constructor(private readonly questionService: QuestionService) {}

	@Get('')
	@UseGuards(AuthGuard('bearer'))
	public getReceivedQuestions(
		@Query('profile') profile: string,
		@ReqUser() reqUser$: Observable<UserEntity>,
	): Observable<QuestionRes[]> {
		if (!profile) throw new BadRequestException();

		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(profile) === -1
				)
					throw new ForbiddenException();

				return this.questionService.getByProfile(profile);
			}),
			map((questions) =>
				questions.map((question) => new QuestionRes(question)),
			),
		);
	}

	@Post('')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public sendQuestion(
		@Body() newQuestion: CreateQuestionReq,
		@ReqUser() reqUser$: Observable<UserEntity>,
	): Observable<QuestionRes> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(newQuestion.from) === -1
				)
					throw new ForbiddenException();

				return this.questionService.add(newQuestion, user.id);
			}),
			map((question) => new QuestionRes(question)),
		);
	}

	@Get(':id')
	@UseGuards(AuthGuard('bearer'))
	public getById(
		@Param('id') id: string,
		@ReqUser() reqUser$: Observable<UserEntity>,
	): Observable<QuestionRes> {
		return forkJoin([reqUser$, this.questionService.get(id)]).pipe(
			tap(([user, question]) => {
				if (!question) {
					throw new NotFoundException();
				}

				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(question.recipient.toHexString()) === -1
				)
					throw new ForbiddenException();
			}),
			map(([, question]) => new QuestionRes(question)),
		);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public delete(
		@Param('id') id: string,
		@ReqUser() reqUser$: Observable<UserEntity>,
	): Observable<void> {
		return forkJoin([reqUser$, this.questionService.get(id)]).pipe(
			mergeMap(([user, question]) => {
				if (!question) {
					throw new NotFoundException();
				}

				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(question.recipient.toHexString()) === -1
				)
					throw new ForbiddenException();

				return this.questionService.delete(id);
			}),
		);
	}
}
