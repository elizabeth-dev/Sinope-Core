import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'date' } })
export class Question extends Document {
	@Prop()
	public content: string;

	@Prop()
	public anonymous: boolean;

	@Prop({ ref: 'Profile' })
	public profile?: Types.ObjectId;

	@Prop({ ref: 'User' })
	public user: Types.ObjectId;

	@Prop({ ref: 'Profile' })
	public recipient: Types.ObjectId;

	@Prop({ ref: 'Post' })
	public answer?: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
