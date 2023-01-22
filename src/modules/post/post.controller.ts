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
import { AddCommentDTO, CreateUpdatePostDTO } from './post.dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { PaginationDTO } from 'src/common/dto/base.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@Body() createPostDto: CreateUpdatePostDTO, @Req() req: Request) {
    const { userId } = req;
    return this.postService.createPost(userId, createPostDto);
  }

  @Put(':postId')
  updatePost(
    @Body() updatePostDto: CreateUpdatePostDTO,
    @Param('postId') postId: string,
    @Req() req: Request,
  ) {
    const { userId } = req;
    return this.postService.updatePost(userId, postId, updatePostDto);
  }

  @Delete(':postId')
  deletePost(@Param('postId') postId: string, @Req() req: Request) {
    const { userId } = req;
    return this.postService.deleteUserPost(userId, postId);
  }

  @Get()
  getPostList(@Req() req: Request, @Query() pagination: PaginationDTO) {
    const { userId } = req;
    return this.postService.getPostList(userId, pagination);
  }

  @Post(':postId/comment')
  addPostComment(
    @Req() req: Request,
    @Body() addCommentDto: AddCommentDTO,
    @Param('postId') postId: string,
  ) {
    const { userId } = req;
    return this.postService.addPostComment(userId, postId, addCommentDto);
  }
}
