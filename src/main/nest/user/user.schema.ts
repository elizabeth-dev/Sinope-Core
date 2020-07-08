import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
	timestamps: { createdAt: 'created', updatedAt: 'updated' },
	toJSON: {
		getters: true,
		versionKey: false,
		transform: (doc, ret: User) => {
			delete ret._id;
			delete ret.password;
			delete ret.updated;

			return ret;
		},
	},
})
export class User extends Document {
	@Prop()
	public name: string;

	@Prop({ required: true, unique: true })
	public email: string;

	@Prop()
	public password: string;

	@Prop()
	public lastLogin: Date;

	@Prop({ ref: 'Profile' })
	public profiles: Types.ObjectId[];

	public updated?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
