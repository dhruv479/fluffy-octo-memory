import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO, LoginUserDTO, UpdateUserStatusDTO } from './user.dto';
import { UserDocument, User } from './user.schema';
import { PasswordUtils } from 'src/common/utils/password';
import { TokenUtil } from 'src/common/utils/token';
import { PaginationDTO } from 'src/common/dto/base.dto';
import { Helper } from 'src/common/helpful';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDTO) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('Email Address duplicate');
    }

    const hash = await new PasswordUtils().generateHash(createUserDto.password);
    const newUser = new this.userModel({ ...createUserDto, password: hash });
    await newUser.save();

    return {
      message: 'User Created Successfully, Login to Continue',
    };
  }

  async loginUser(loginDto: LoginUserDTO) {
    const user = await this.userModel.findOne({ email: loginDto.email }).lean();

    if (!user) {
      throw new UnauthorizedException('Invalid user details');
    }

    if (!user.is_active) {
      throw new ForbiddenException('Account disabled, please contact admin');
    }

    const passMatch = await new PasswordUtils().comparePassword(
      loginDto.password,
      user.password,
    );

    if (!passMatch) {
      throw new UnauthorizedException('Invalid user details');
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      last_login_at: new Date(),
    });

    const tokenPayload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      type: user.type,
    };

    const token = await new TokenUtil().generate(tokenPayload);

    return {
      token,
      details: tokenPayload,
    };
  }

  async updateUserStatus(userId: string, updateUserDto: UpdateUserStatusDTO) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Invalid User');
    }

    await this.userModel.findByIdAndUpdate(userId, {
      is_active: updateUserDto.is_active,
    });

    return {
      message: 'User updated successfully',
    };
  }

  async getUserList(pagination: PaginationDTO) {
    const paginationParams = Helper.validatePagination(pagination);

    const query = {};
    if (paginationParams._id) {
      query['_id'] = paginationParams._id;
    }
    if (pagination.search) {
      query['$or'] = [
        { name: new RegExp(pagination.search, 'ig') },
        { email: new RegExp(pagination.search, 'ig') },
      ];
    }
    const users = await this.userModel
      .find(
        query,
        { _id: true, last_login_at: true, name: true, email: true, type: true },
        paginationParams.queryPart,
      )
      .lean();
    return users;
  }

  async getAllUserListDetailed(pagination: PaginationDTO) {
    const paginationParams = Helper.validatePagination(pagination);

    const userQuery = { is_active: true };
    if (paginationParams._id) {
      userQuery['_id'] = paginationParams._id;
    }
    if (pagination.search) {
      userQuery['$or'] = [
        { name: new RegExp(pagination.search, 'ig') },
        { email: new RegExp(pagination.search, 'ig') },
      ];
    }

    const allUserDetails = await this.userModel
      .aggregate()
      .match(userQuery)
      .project({
        name: 1,
        _id: 1,
      })
      .lookup({
        from: 'Todo',
        foreignField: 'user_id',
        localField: '_id',
        pipeline: [
          { $match: { $expr: { $eq: ['$is_deleted', false] } } },
          { $project: { title: 1, is_completed: 1 } },
        ],
        as: 'todos',
      })
      .lookup({
        from: 'Post',
        foreignField: 'user_id',
        localField: '_id',
        pipeline: [
          { $match: { $expr: { $eq: ['$is_deleted', false] } } },
          { $project: { title: 1, is_completed: 1 } },
        ],
        as: 'posts',
      })
      .limit(paginationParams.queryPart.limit)
      .skip(paginationParams.queryPart.skip)
      .sort(paginationParams.queryPart.sort);
    return allUserDetails;
  }
}
