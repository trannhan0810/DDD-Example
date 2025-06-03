import { Get, SerializeOptions, applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const GetAPI = (path: string, opts: { res: ClassType<unknown> }) =>
  applyDecorators(
    Get(path),
    ApiResponse({ type: opts.res }),
    SerializeOptions({ type: opts.res, strategy: 'exposeAll', excludeExtraneousValues: true }),
  );
