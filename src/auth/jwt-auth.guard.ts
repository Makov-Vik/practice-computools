import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { BAN, NOT_AUTHORIZED, NO_ACCESS, ROLE } from '../constants';
import { ROLE_KEY } from './checkRole.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService, private reflector: Reflector) {
  super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {

    //check on role
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (requiredRoles && !requiredRoles.includes(ROLE[user.roleId])){
      throw new HttpException(NO_ACCESS, HttpStatus.FORBIDDEN);
    }

      // check ban
      if (user.ban) {
        throw new HttpException({ ...BAN, banReason: user.banReason}, HttpStatus.FORBIDDEN)
      }

    return user
  }
}
