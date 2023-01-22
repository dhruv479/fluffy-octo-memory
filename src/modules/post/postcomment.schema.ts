import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({
  collection: 'PostComment',
  minimize: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class PostComment {
  _id: Types.ObjectId;

  @Prop()
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post_id: Types.ObjectId;
}

export const PostCommentSchema = SchemaFactory.createForClass(PostComment);
export type PostCommentDocument = PostComment & Document;
