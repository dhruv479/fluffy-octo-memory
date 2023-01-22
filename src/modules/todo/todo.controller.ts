import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CreateUpdateTodoDTO } from './todo.dto';
import { TodoService } from './todo.service';
import { Request } from 'express';
import { PaginationDTO } from 'src/common/dto/base.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  createTodo(@Body() createTodoDto: CreateUpdateTodoDTO, @Req() req: Request) {
    const { userId } = req;
    return this.todoService.createTodo(userId, createTodoDto);
  }

  @Put(':todoId')
  updateTodo(
    @Body() updateTodoDto: CreateUpdateTodoDTO,
    @Param('todoId') todoId: string,
    @Req() req: Request,
  ) {
    const { userId } = req;
    return this.todoService.updateTodo(userId, todoId, updateTodoDto);
  }

  @Delete(':todoId')
  deleteTodo(@Param('todoId') todoId: string, @Req() req: Request) {
    const { userId } = req;
    return this.todoService.deleteUserTodo(userId, todoId);
  }

  @Get()
  getTodoList(@Req() req: Request, @Query() pagination: PaginationDTO) {
    const { userId } = req;
    return this.todoService.getTodoList(userId, pagination);
  }
}
