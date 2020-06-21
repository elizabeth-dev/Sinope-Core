import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'date' } })
export class PostEntity extends Document {
	@Prop()
	public content: string;

	@Prop({ ref: 'Profile' })
	public profile: Types.ObjectId;

	@Prop({ ref: 'User' })
	public user: Types.ObjectId;

	@Prop({ ref: 'Profile' })
	public likes: Types.ObjectId[];

	@Prop({ ref: 'Question' })
	public question?: Types.ObjectId;
}

export const PostEntitySchema = SchemaFactory.createForClass(PostEntity);
