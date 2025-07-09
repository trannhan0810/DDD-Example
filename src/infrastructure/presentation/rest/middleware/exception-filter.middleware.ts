import { DomainError } from '@domain/shared/common/base.error';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const [request, response] = [ctx.getRequest(), ctx.getResponse()];

    const responseBody = this.handleException(exception);
    const apiPath = httpAdapter.getRequestUrl(request);
    httpAdapter.reply(response, { ...responseBody, path: apiPath }, responseBody.statusCode);
  }

  handleException(exception: unknown) {
    if (exception instanceof DomainError) {
      return {
        statusCode: 400,
        message: exception.message,
      };
    }
    if (exception instanceof HttpException) {
      return {
        statusCode: exception.getStatus(),
        message: exception.message,
      };
    }
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: (exception as { message?: string }).message ?? 'Internal server error',
    };
  }
}
