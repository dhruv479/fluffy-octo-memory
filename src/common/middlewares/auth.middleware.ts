import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Helper } from '../helpful';
import { TokenUtil } from '../utils/token';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const NO_AUTH = process.env.NO_AUTH;

      if (Helper.parseBoolean(NO_AUTH)) {
        next();
      }

      const authToken = req.headers.authorization as string;

      if (!authToken) {
        throw new UnauthorizedException('Unauthorized Access! Please login.');
      }

      const [, token] = authToken.split(' ');

      if (!token) {
        throw new UnauthorizedException('Unauthorized Access! Please login.');
      }

      const decoded = await new TokenUtil().verify(token);
      req.USER = decoded;
      req.userId = decoded._id;

      next();
    } catch {
      throw new UnauthorizedException('Unauthorized Access! Please login.');
    }
  }
}
