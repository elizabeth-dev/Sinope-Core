import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created' } })
export class RefreshTokenEntity extends Document {
	@Prop({ required: true, unique: true })
	public refreshToken: string;

	@Prop({ required: true, ref: 'User' })
	public user: Types.ObjectId;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenEntity);
