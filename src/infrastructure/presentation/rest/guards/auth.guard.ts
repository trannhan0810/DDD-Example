import { IJwtService } from '@application/common/jwt';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export type CurrentUser = { id: Id; email: string; fullName: string };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector, private readonly jwtService: IJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this._reflector.getAllAndOverride('IsPublishAPI', [context.getClass(), context.getHandler()]);
    if (isPublic) {
      request['isPublic'] = true;
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyToken(token);
      const currentUser: CurrentUser = {
        id: payload.id,
        email: payload.email,
        fullName: `${payload.firstname} ${payload.lastname}`,
      };
      request['user'] = currentUser;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

/** Decorator to ger authenticated user in controller */
export const UserCtx = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (request['isPublic'] === true) {
    throw Error('This API is public');
  }
  return request.user;
});

/** Decorator to make API public */
export const PublicAPI = () => SetMetadata('IsPublishAPI', true);
