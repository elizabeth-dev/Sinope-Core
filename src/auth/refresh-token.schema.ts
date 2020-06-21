import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created' } })
export class RefreshToken extends Document {
	@Prop({ required: true, unique: true })
	public refreshToken: string;

	@Prop({ required: true, ref: 'user' })
	public user: Types.ObjectId;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
