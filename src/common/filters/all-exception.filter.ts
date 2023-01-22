import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Constants } from '../constants';
import { ErrorResponse } from '../dto/base.dto';
import { Helper } from '../helpful';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException | any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: ErrorResponse = {
      success: false,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message:
        httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : exception?.response?.message,
      name: exception?.name,
    };

    if (process.env.NODE_ENV === Constants.DEV_ENV && exception.stack) {
      responseBody = { ...responseBody, stack: exception.stack };
    }

    if (Helper.parseBoolean(process.env.DEBUG)) {
      console.error(exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
