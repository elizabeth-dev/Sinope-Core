import { Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EMPTY, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { User } from '../shared/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { QuestionEntity } from './question.entity';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
	constructor(private readonly questionService: QuestionService) {
	}

	@Get(':id')
	@UseGuards(AuthGuard('jwt'))
	public getById(
		@Param('id') id: string,
		@User() user: UserEntity,
	): Observable<QuestionEntity> {
		return this.questionService.get(id).pipe(tap((question) => {
			if (!question) {
				throw new NotFoundException();
			}

			if (user.profileIds.indexOf(question.recipient.id) === -1) {
				throw new ForbiddenException();
			}

			return question;
		}));
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public delete(
		@Param('id') id: string,
		@User() user: UserEntity,
	): Observable<void> {
		return this.questionService.get(id).pipe(mergeMap((question) => {
			if (!question) {
				throw new NotFoundException();
			}

			if (user.profileIds.indexOf(question.recipient.id) === -1) {
				throw new ForbiddenException();
			}

			return this.questionService.delete(id).pipe(mergeMap(() => EMPTY));
		}));

	}
}
