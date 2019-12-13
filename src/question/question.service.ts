import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, Repository } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
import { UserEntity } from '../user/user.entity';
import { CreateQuestionDto } from './definitions/CreateQuestion.dto';
import { QuestionEntity } from './question.entity';

@Injectable()
export class QuestionService {
	constructor(@InjectRepository(QuestionEntity) private readonly questionRepo: Repository<QuestionEntity>) {
	}

	public get(id: string): Observable<QuestionEntity>;
	public get(id?: string[]): Observable<QuestionEntity[]>;
	public get(id?: string | string[]): Observable<QuestionEntity | QuestionEntity[]> {
		if (!id) {
			return from(this.questionRepo.find());
		}

		if (typeof id === 'string') {
			return from(this.questionRepo.findOne(id));
		}

		return from(this.questionRepo.findByIds(id));
	}

	public add(
		newQuestion: CreateQuestionDto,
		author: ProfileEntity,
		authorUser: UserEntity,
		recipient: ProfileEntity,
	): Observable<QuestionEntity> {
		const question = this.questionRepo.create({
			...newQuestion,
			author,
			recipient,
			authorUser,
		});

		return from(this.questionRepo.save(question));
	}

	public delete(id: string): Observable<DeleteResult> {
		return from(this.questionRepo.delete(id));
	}
}
