import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessDto, SuccessResponse } from '../dto/base.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessDto<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = new SuccessResponse(data);
        return response;
      }),
    );
  }
}
