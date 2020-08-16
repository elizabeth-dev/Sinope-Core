import {
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	UseGuards,
	Query,
	Post,
	Body,
	BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Question } from './question.schema';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './definitions/CreateQuestion.dto';
import { ReqUser } from '../shared/decorators/user.decorator';
import { User } from '../user/user.schema';

@Controller('questions')
export class QuestionController {
	constructor(private readonly questionService: QuestionService) {}

	@Get('')
	@UseGuards(AuthGuard('bearer'))
	public getReceivedQuestions(
		@Query('profile') profile: string,
	): Observable<Question[]> {
		if (!profile) throw new BadRequestException();

		/*if (user.profileIds.indexOf(profileId) === -1) {
			throw new ForbiddenException();
		}*/

		return this.questionService.getByProfile(profile);
	}

	@Post('')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public sendQuestion(
		@Body() newQuestion: CreateQuestionDto,
		@ReqUser() user: Observable<User>,
	): Observable<Question> {
		return user.pipe(
			mergeMap((user) => this.questionService.add(newQuestion, user.id)),
		);
	}

	@Get(':id')
	@UseGuards(AuthGuard('bearer'))
	public getById(@Param('id') id: string): Observable<Question> {
		return this.questionService.get(id).pipe(
			tap((question) => {
				if (!question) {
					throw new NotFoundException();
				}

				/*if (user.profileIds.indexOf(question.recipient.id) === -1) {
				throw new ForbiddenException();
			}*/
			}),
		);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('bearer'))
	public delete(@Param('id') id: string): Observable<void> {
		return this.questionService.get(id).pipe(
			mergeMap((question) => {
				if (!question) {
					throw new NotFoundException();
				}

				/*if (user.profileIds.indexOf(question.recipient.id) === -1) {
					throw new ForbiddenException();
				}*/

				return this.questionService.delete(id);
			}),
		);
	}
}
