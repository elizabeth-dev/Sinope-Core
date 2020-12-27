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
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ReqUser } from '../shared/decorators/user.decorator';
import { User } from '../user/user.schema';
import { CreateQuestionDto } from './definitions/CreateQuestion.dto';
import { Question } from './question.schema';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
	constructor(private readonly questionService: QuestionService) {}

	@Get('')
	@UseGuards(AuthGuard('bearer'))
	public getReceivedQuestions(
		@Query('profile') profile: string,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<Question[]> {
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
		);
	}

	@Post('')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public sendQuestion(
		@Body() newQuestion: CreateQuestionDto,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<Question> {
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
		);
	}

	@Get(':id')
	@UseGuards(AuthGuard('bearer'))
	public getById(
		@Param('id') id: string,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<Question> {
		return forkJoin(reqUser$, this.questionService.get(id)).pipe(
			map(([user, question]) => {
				if (!question) {
					throw new NotFoundException();
				}

				if (
					user.profiles
						.map((el) => el.toHexString())
						.indexOf(question.recipient.toHexString()) === -1
				)
					throw new ForbiddenException();

				return question;
			}),
		);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public delete(
		@Param('id') id: string,
		@ReqUser() reqUser$: Observable<User>,
	): Observable<void> {
		return forkJoin(reqUser$, this.questionService.get(id)).pipe(
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
