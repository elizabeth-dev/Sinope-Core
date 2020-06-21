import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';
import { CreatePostDto } from '../post/definitions/CreatePost.dto';
import { PostEntity } from '../post/post.schema';
import { PostService } from '../post/post.service';
import { CreateQuestionDto } from '../question/definitions/CreateQuestion.dto';
import { Question } from '../question/question.schema';
import { QuestionService } from '../question/question.service';
import { ReqUser } from '../shared/decorators/user.decorator';
import { CreateProfileDto } from './definitions/CreateProfile.dto';
import { UpdateProfileDto } from './definitions/UpdateProfile.dto';
import { Profile } from './profile.schema';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
	constructor(
		private readonly profileService: ProfileService,
		private readonly postService: PostService,
		private readonly questionService: QuestionService,
	) {}

	@Get(':id')
	public get(@Param('id') id: string): Observable<Profile> {
		return this.profileService.get(id).pipe(
			tap((profile) => {
				if (!profile) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	public create(
		@Body() newProfile: CreateProfileDto,
		@ReqUser() user: JwtPayload,
	): Observable<Profile> {
		return this.profileService.create(newProfile, user.sub);
	}

	@Delete(':id')
	@HttpCode(204)
	@UseGuards(AuthGuard('jwt'))
	public delete(@Param('id') id: string): Observable<void> {
		return this.profileService.get(id).pipe(
			mergeMap((profile) => {
				if (!profile) {
					throw new NotFoundException();
				}

				/*if (profile.managerIds.indexOf(user.id) === -1) {
					throw new ForbiddenException();
				}*/

				return this.profileService.delete(id);
			}),
		);
	}

	@Put(':id')
	@UseGuards(AuthGuard('jwt'))
	public update(
		@Param('id') profile: string,
		@Body() partial: UpdateProfileDto,
	): Observable<Profile> {
		return this.profileService.update(profile, partial);
	}

	@Put(':id/managers/:userId')
	@UseGuards(AuthGuard('jwt'))
	public addManager(
		@Param('id') profile: string,
		@Param('userId') manager: string,
	): Observable<void> {
		return this.profileService.addManager(profile, manager);
	}

	@Delete(':id/managers/:userId')
	@UseGuards(AuthGuard('jwt'))
	public removeManager(
		@Param('id') profile: string,
		@Param('userId') manager: string,
	): Observable<void> {
		return this.profileService.removeManager(profile, manager);
	}

	@Get(':id/followers')
	public getFollowers(@Param('id') profileId: string): Observable<Profile[]> {
		return this.profileService.getFollowers(profileId).pipe(
			tap((followers) => {
				if (!followers) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Get(':id/following')
	public getFollowing(@Param('id') profileId: string): Observable<Profile[]> {
		return this.profileService.getFollowing(profileId).pipe(
			tap((following) => {
				if (!following) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Put(':id/followers/:follower')
	@UseGuards(AuthGuard('jwt'))
	public follow(
		@Param('id') profile: string,
		@Param('follower') follower: string,
	): Observable<void> {
		/*if (user.profileIds.indexOf(follower) === -1) {
			throw new ForbiddenException();
		}*/

		if (profile === follower) {
			throw new BadRequestException();
		}

		return this.profileService.follow(profile, follower);
	}

	@Delete(':id/followers/:follower')
	@UseGuards(AuthGuard('jwt'))
	public unfollow(
		@Param('id') profile: string,
		@Param('follower') unfollower: string,
	): Observable<void> {
		/*if (user.profileIds.indexOf(unfollower) === -1) {
			throw new ForbiddenException();
		}*/

		if (profile === unfollower) {
			throw new BadRequestException();
		}

		return this.profileService.unfollow(profile, unfollower);
	}

	@Get(':id/posts')
	public getPosts(@Param('id') profileId: string): Observable<PostEntity[]> {
		return this.postService.getByProfile(profileId).pipe(
			tap((posts) => {
				if (!posts) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Get(':id/posts/messages')
	public getPostedMessages(
		@Param('id') profileId: string,
	): Observable<PostEntity[]> {
		return this.postService.getMessages(profileId).pipe(
			tap((posts) => {
				if (!posts) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Get(':id/posts/questions')
	public getPostedQuestions(
		@Param('id') profileId: string,
	): Observable<PostEntity[]> {
		return this.postService.getQuestions(profileId).pipe(
			tap((posts) => {
				if (!posts) {
					throw new NotFoundException();
				}
			}),
		);
	}

	@Post(':id/posts')
	@UseGuards(AuthGuard('jwt'))
	public addPost(
		@Body() newPost: CreatePostDto,
		@Param('id') profile: string,
		@ReqUser() user: JwtPayload,
	): Observable<PostEntity> {
		/*if (user.profileIds.indexOf(profileId) === -1) {
			throw new ForbiddenException();
		}*/

		return this.postService.add(newPost, profile, user.sub);
	}

	@Get(':id/questions')
	@UseGuards(AuthGuard('jwt'))
	public getReceivedQuestions(
		@Param('id') profile: string,
	): Observable<Question[]> {
		/*if (user.profileIds.indexOf(profileId) === -1) {
			throw new ForbiddenException();
		}*/

		return this.questionService.getByProfile(profile);
	}

	@Post(':id/questions')
	@UseGuards(AuthGuard('jwt'))
	public sendQuestion(
		@Body() newQuestion: CreateQuestionDto,
		@ReqUser() user: JwtPayload,
	): Observable<Question> {
		return this.questionService.add(newQuestion, user.sub);
	}

	@Get(':id/timeline')
	@UseGuards(AuthGuard('jwt'))
	public timeline(@Param('id') profileId: string): Observable<PostEntity[]> {
		/*if (user.profileIds.indexOf(profileId) === -1) {
			throw new ForbiddenException();
		}*/

		return this.profileService.getFollowingIds(profileId).pipe(
			mergeMap((followingIds) => {
				if (followingIds.length === 0) {
					return [];
				}

				return this.postService.getByProfile(followingIds);
			}),
		);
	}
}
