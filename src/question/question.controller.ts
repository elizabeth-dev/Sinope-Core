import {
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Question } from './question.schema';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
	constructor(private readonly questionService: QuestionService) {}

	@Get(':id')
	@UseGuards(AuthGuard('jwt'))
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
	@UseGuards(AuthGuard('jwt'))
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
