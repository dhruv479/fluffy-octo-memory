import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Constants } from '../constants';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { USER } = request;
    if (USER?.type === Constants.USERTYPES.ADMIN) {
      return true;
    }
    throw new ForbiddenException('No Permission for this Action');
  }
}
