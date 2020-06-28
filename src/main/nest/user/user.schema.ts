import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created' } })
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
}

export const UserSchema = SchemaFactory.createForClass(User);
