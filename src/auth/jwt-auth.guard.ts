import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.model';
import { ROLE } from '../constants';
import * as Response from '../response.messages';
import { ROLE_KEY } from './checkRole.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor( private reflector: Reflector) {
  super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(_err: never, user: User, _info: never, context: ExecutionContext) {

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (requiredRoles && !requiredRoles.includes(ROLE[user.roleId])){
      throw new HttpException(Response.NO_ACCESS, HttpStatus.FORBIDDEN);
    }

      if (user.ban) {
        throw new HttpException({ ... Response.BAN, banReason: user.banReason}, HttpStatus.FORBIDDEN)
      }

    return user
  }
}
