import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { Constants } from '../../common/constants';

@Schema({
  collection: 'User',
  minimize: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    enum: Object.values(Constants.USERTYPES),
    default: Constants.USERTYPES.USER,
  })
  type: string;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  last_login_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
