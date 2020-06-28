import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created' } })
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
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
