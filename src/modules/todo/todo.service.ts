import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationDTO } from 'src/common/dto/base.dto';
import { Helper } from 'src/common/helpful';
import { CreateUpdateTodoDTO } from './todo.dto';
import { Todo, TodoDocument } from './todo.schema';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}

  async createTodo(userId: string, createTodoDto: CreateUpdateTodoDTO) {
    const objectUserId = new Types.ObjectId(userId);
    const checkTodo = await this.todoModel
      .findOne({
        user_id: objectUserId,
        title: createTodoDto.title,
        is_deleted: false,
      })
      .lean();

    if (checkTodo) {
      throw new BadRequestException('Todo exists, please check');
    }

    const newTodo = new this.todoModel({
      user_id: objectUserId,
      title: createTodoDto.title,
    });
    await newTodo.save();

    return {
      message: 'Todo Created Successfully',
    };
  }

  async getTodoList(userId: string, pagination: PaginationDTO) {
    const paginationParams = Helper.validatePagination(pagination);
    const query = { user_id: new Types.ObjectId(userId), is_deleted: false };
    if (paginationParams._id) {
      query['_id'] = paginationParams._id;
    }
    if (pagination.search) {
      query['title'] = new RegExp(pagination.search, 'ig');
    }
    const todoList = await this.todoModel
      .find(
        query,
        {
          is_completed: true,
          title: true,
          _id: true,
          updated_at: true,
        },
        paginationParams.queryPart,
      )
      .lean();

    return todoList;
  }

  async deleteUserTodo(userId: string, todoId: string) {
    const todo = await this.todoModel
      .findOne({ user_id: new Types.ObjectId(userId), _id: todoId })
      .lean();
    if (!todo) {
      throw new BadRequestException('Invalid Todo, please try again');
    }

    await this.todoModel.findByIdAndUpdate(todo._id, { is_deleted: true });

    return {
      message: 'Todo Deleted Successfully',
    };
  }

  async updateTodo(
    userId: string,
    todoId: string,
    updateTodoDto: CreateUpdateTodoDTO,
  ) {
    const todo = await this.todoModel
      .findOne({ user_id: new Types.ObjectId(userId), _id: todoId })
      .lean();
    if (!todo) {
      throw new BadRequestException('Invalid Todo, please try again');
    }

    await this.todoModel.findByIdAndUpdate(todo._id, updateTodoDto);

    return {
      message: 'Todo Updated Successfully',
    };
  }
}
