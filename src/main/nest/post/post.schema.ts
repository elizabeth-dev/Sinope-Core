import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HookSyncCallback, Schema as mSchema, Types } from 'mongoose';

@Schema({
	timestamps: {
		createdAt: 'date',
		updatedAt: false,
	},
	toJSON: {
		getters: true,
		versionKey: false,
		transform: (doc, ret: PostEntity) => {
			delete ret._id;
			delete ret.user;

			return ret;
		},
	},
})
export class PostEntity extends Document {
	@Prop()
	public content: string;

	@Prop({ ref: 'Profile' })
	public profile: Types.ObjectId;

	@Prop({ ref: 'User' })
	public user: Types.ObjectId;

	@Prop([{ type: mSchema.Types.ObjectId, ref: 'Profile' }])
	public likes: Types.ObjectId[];

	@Prop({ ref: 'Question' })
	public question?: Types.ObjectId;
}

const populateProfile: HookSyncCallback<PostEntity> = (next) => {
	this.populate('profile');
	next();
};

export const PostEntitySchema = SchemaFactory.createForClass(PostEntity)
	.pre('find', populateProfile)
	.pre('findOne', populateProfile)
	.pre('findOneAndUpdate', populateProfile)
	.pre('save', populateProfile);
