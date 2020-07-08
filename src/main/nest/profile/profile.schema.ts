import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
	timestamps: { createdAt: 'created', updatedAt: 'updated' },
	toJSON: {
		getters: true,
		versionKey: false,
		transform: (doc, ret: Profile) => {
			delete ret._id;
			delete ret.updated;

			return ret;
		},
	},
})
export class Profile extends Document {
	@Prop({ unique: true })
	public tag: string;

	@Prop()
	public name: string;

	@Prop()
	public description: string;

	@Prop({ ref: 'User' })
	public managers: Types.ObjectId[];

	@Prop({ ref: 'Profile' })
	public following: Types.ObjectId[];

	@Prop({ ref: 'Profile' })
	public followers: Types.ObjectId[];

	public updated?: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
