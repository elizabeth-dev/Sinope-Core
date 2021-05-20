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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { checkPerms } from 'src/shared/utils/user.utils';
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
	@ApiQuery({
		name: 'expand',
		isArray: true,
		required: false,
		description: 'Select which fields should be expanded (populated) on the response',
	})
	public getReceivedQuestions(
		@Query('profile') profile: string,
		@ReqUser() reqUser$: Observable<UserEntity>,
		@Query('expand') expand: string[] | string,
	): Observable<QuestionRes[]> {
		if (!profile) throw new BadRequestException();

		return reqUser$.pipe(
			mergeMap((user) => {
				if (checkPerms(user, profile)) throw new ForbiddenException();

				return this.questionService.getByProfile(profile, expand);
			}),
			map((questions) => questions.map((question) => new QuestionRes(question))),
		);
	}

	@Post('')
	@HttpCode(201)
	@UseGuards(AuthGuard('bearer'))
	@ApiQuery({
		name: 'expand',
		isArray: true,
		required: false,
		description: 'Select which fields should be expanded (populated) on the response',
	})
	public sendQuestion(
		@Body() newQuestion: CreateQuestionReq,
		@ReqUser() reqUser$: Observable<UserEntity>,
		@Query('expand') expand: string[] | string,
	): Observable<QuestionRes> {
		return reqUser$.pipe(
			mergeMap((user) => {
				if (checkPerms(user, newQuestion.from)) throw new ForbiddenException();

				return this.questionService.add(newQuestion, user.id, expand);
			}),
			map((question) => new QuestionRes(question)),
		);
	}

	@Get(':id')
	@UseGuards(AuthGuard('bearer'))
	@ApiQuery({
		name: 'expand',
		isArray: true,
		required: false,
		description: 'Select which fields should be expanded (populated) on the response',
	})
	public getById(
		@Param('id') id: string,
		@ReqUser() reqUser$: Observable<UserEntity>,
		@Query('expand') expand: string[] | string,
	): Observable<QuestionRes> {
		return forkJoin([reqUser$, this.questionService.get(id, expand)]).pipe(
			tap(([user, question]) => {
				if (!question) throw new NotFoundException();

				if (checkPerms(user, question.recipient.toHexString())) throw new ForbiddenException();
			}),
			map(([, question]) => new QuestionRes(question)),
		);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public delete(@Param('id') id: string, @ReqUser() reqUser$: Observable<UserEntity>): Observable<void> {
		return forkJoin([reqUser$, this.questionService.get(id)]).pipe(
			mergeMap(([user, question]) => {
				if (!question) throw new NotFoundException();

				if (checkPerms(user, question.recipient.toHexString())) throw new ForbiddenException();

				return this.questionService.delete(id);
			}),
		);
	}
}
