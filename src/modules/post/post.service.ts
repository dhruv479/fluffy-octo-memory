import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginationDTO } from 'src/common/dto/base.dto';
import { Helper } from 'src/common/helpful';
import { AddCommentDTO, CreateUpdatePostDTO } from './post.dto';
import { Post, PostDocument } from './post.schema';
import { PostComment, PostCommentDocument } from './postcomment.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(PostComment.name)
    private readonly postCommentModel: Model<PostCommentDocument>,
  ) {}

  async createPost(userId: string, createPostDto: CreateUpdatePostDTO) {
    const objectUserId = new Types.ObjectId(userId);
    const checkPost = await this.postModel
      .findOne({
        user_id: objectUserId,
        title: createPostDto.title,
        is_deleted: false,
      })
      .lean();

    if (checkPost) {
      throw new BadRequestException('Post exists, please check');
    }

    const newPost = new this.postModel({
      user_id: objectUserId,
      title: createPostDto.title,
      description: createPostDto.description,
    });
    await newPost.save();

    return {
      message: 'Post Created Successfully',
    };
  }

  async getPostList(userId: string, pagination: PaginationDTO) {
    const paginationParams = Helper.validatePagination(pagination);
    const query = { user_id: new Types.ObjectId(userId), is_deleted: false };
    if (paginationParams._id) {
      query['_id'] = paginationParams._id;
    }
    if (pagination.search) {
      query['title'] = new RegExp(pagination.search, 'ig');
    }
    const postList = await this.postModel
      .find(
        query,
        {
          is_completed: true,
          title: true,
          _id: true,
          updated_at: true,
          comments: true,
        },
        paginationParams.queryPart,
      )
      .populate('comments', 'text', 'PostComment')
      .lean();

    return postList;
  }

  async deleteUserPost(userId: string, postId: string) {
    const post = await this.postModel
      .findOne({ user_id: new Types.ObjectId(userId), _id: postId })
      .lean();
    if (!post) {
      throw new BadRequestException('Invalid Post, please try again');
    }

    await this.postModel.findByIdAndUpdate(post._id, { is_deleted: true });

    return {
      message: 'Post Deleted Successfully',
    };
  }

  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: CreateUpdatePostDTO,
  ) {
    const post = await this.postModel
      .findOne({ user_id: new Types.ObjectId(userId), _id: postId })
      .lean();
    if (!post) {
      throw new BadRequestException('Invalid Post, please try again');
    }

    await this.postModel.findByIdAndUpdate(post._id, updatePostDto);

    return {
      message: 'Post Updated Successfully',
    };
  }

  async addPostComment(
    userId: string,
    postId: string,
    addCommentDto: AddCommentDTO,
  ) {
    const post = await this.postModel
      .findById(new Types.ObjectId(postId))
      .lean();
    if (!post) {
      throw new BadRequestException('Invalid Post');
    }
    const newComment = new this.postCommentModel({
      user_id: new Types.ObjectId(userId),
      post_id: post._id,
      text: addCommentDto.text,
    });
    await newComment.save();

    await this.postModel.findByIdAndUpdate(post._id, {
      $push: { comments: newComment._id },
    });

    return {
      message: 'Comment saved successfully',
    };
  }
}
