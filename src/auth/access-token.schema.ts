import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created' } })
export class AccessTokenEntity extends Document {
	@Prop({ required: true, unique: true })
	public accessToken: string;

	@Prop({ required: true, ref: 'RefreshToken' })
	public refreshToken: string;

	@Prop({ required: true, ref: 'User' })
	public user: Types.ObjectId;

	@Prop({ required: true })
	public expiresAt: Date;

	@Prop()
	public lastAccess?: Date;
}

export const AccessTokenSchema = SchemaFactory.createForClass(
	AccessTokenEntity,
);
