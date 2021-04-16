import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
	timestamps: { createdAt: 'created', updatedAt: 'updated' },
	toJSON: {
		getters: true,
		versionKey: false,
		transform: (doc, ret: ProfileEntity) => {
			delete ret._id;
			delete ret.updated;

			return ret;
		},
	},
	toObject: {
		// FIXME: Calling toObject at PostService to mutate "following" fields
		getters: true,
		versionKey: false,
		transform: (doc, ret: ProfileEntity) => {
			delete ret._id;
			delete ret.updated;

			return ret;
		},
	},
})
export class ProfileEntity extends Document {
	@Prop({ unique: true })
	public tag: string;

	@Prop()
	public name: string;

	@Prop()
	public description: string;

	@Prop({ ref: 'Profile' })
	public following: Types.ObjectId[];

	@Prop({ ref: 'Profile' })
	public followers: Types.ObjectId[];

	public updated?: Date;
	public created: Date;

	public followingThem?: boolean;
	public followingMe?: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(ProfileEntity);
