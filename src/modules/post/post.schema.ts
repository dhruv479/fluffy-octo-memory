import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({
  collection: 'Post',
  minimize: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Post {
  _id: Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'PostComment' })
  comments: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
export type PostDocument = Post & Document;
