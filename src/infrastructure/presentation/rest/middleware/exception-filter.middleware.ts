import { DomainError } from '@domain/shared/common/base.error';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const responseBody = {
      ...this.getBody(exception),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }

  getBody(exception: unknown) {
    if (exception instanceof DomainError) {
      return { statusCode: 400, message: exception.message };
    }
    if (exception instanceof HttpException) {
      return { statusCode: exception.getStatus(), message: exception.message };
    }
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: (exception as { message?: string }).message ?? 'Internal server error',
    };
  }
}
