import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as mSchema } from 'mongoose';

@Schema({
	timestamps: { createdAt: 'created', updatedAt: 'updated' },
	toJSON: {
		getters: true,
		versionKey: false,
		transform: (doc, ret: UserEntity) => {
			delete ret._id;
			delete ret.password;
			delete ret.updated;

			return ret;
		},
	},
})
export class UserEntity extends Document {
	@Prop({ required: true, unique: true })
	public email: string;

	@Prop()
	public password: string;

	@Prop([{ type: mSchema.Types.ObjectId, ref: 'Profile' }])
	public profiles: Types.ObjectId[];

	public updated?: Date;
	public created: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
