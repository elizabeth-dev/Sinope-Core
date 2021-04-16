import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
	timestamps: { createdAt: 'date', updatedAt: false },
	toJSON: {
		getters: true,
		versionKey: false,
		transform: (doc, ret: QuestionEntity) => {
			delete ret._id;
			delete ret.user;

			if (ret.anonymous) delete ret.from;

			return ret;
		},
	},
})
export class QuestionEntity extends Document {
	@Prop()
	public content: string;

	@Prop()
	public anonymous: boolean;

	@Prop({ ref: 'Profile' })
	public from?: Types.ObjectId;

	@Prop({ ref: 'User' })
	public user: Types.ObjectId;

	@Prop({ ref: 'Profile' })
	public recipient: Types.ObjectId;

	@Prop({ ref: 'Post' })
	public answer?: Types.ObjectId;

	public date: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionEntity);
