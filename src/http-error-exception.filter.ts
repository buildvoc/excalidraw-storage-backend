import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpErrorExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception['response']['message'] ||
          exception['response']['error'] ||
          exception['response']['error']['message'] ||
          exception['message']['error'] ||
          exception['message']['error']['message'] ||
          exception['message'] ||
          exception.toString()
        : String(exception);

    response.status(httpStatus).json({
      data: null,
      success: httpStatus === HttpStatus.OK,
      message: Array.isArray(message) ? message : [message],
    });
  }
}
