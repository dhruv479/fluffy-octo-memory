import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({
  collection: 'Todo',
  minimize: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Todo {
  _id: Types.ObjectId;

  @Prop()
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({ default: false })
  is_completed: boolean;

  @Prop({ default: false })
  is_deleted: boolean;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
export type TodoDocument = Todo & Document;
