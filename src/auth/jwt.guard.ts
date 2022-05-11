import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { NO_ACCESS, ROLE } from 'src/constants';
import { ROLE_KEY } from './checkRole.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  
  canActivate(context: ExecutionContext) {
    // const req = context.switchToHttp().getRequest();
    // req.user = user;
    return super.canActivate(context);
  }
    //
    
    //   const authHeader = req.headers.authorization;
    //   const bearer = authHeader.split(' ')[0].toLowerCase();
    //   const token = authHeader.split(' ')[1];

    //   if (bearer !== 'bearer' || !token) {
    //     throw new UnauthorizedException(NOT_AUTHORIZED);
    //   }
    //   let user;
    //   try {
    //     user = this.jwtService.verify(token);
    //   } catch {
    //     throw new UnauthorizedException(NOT_AUTHORIZED);
    //   }
    
    // req.user = user;

 

    //   if (requiredRoles && !requiredRoles.includes(ROLE[req.user.roleId])){
    //     throw new HttpException(NO_ACCESS, HttpStatus.FORBIDDEN);
    //   }
      
      // // check ban
      // if (user.ban) {
      //   throw new HttpException({ ...BAN, banReason: user.banReason}, HttpStatus.FORBIDDEN)
      // }

      // return true;
  //}

  checkRole(err: any, user: any, info: any, context: ExecutionContext) {
    // const req = context.switchToHttp().getRequest();
    // req.user = user;

    console.log(user);
    //check on role
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (requiredRoles && !requiredRoles.includes(ROLE[user.roleId])){
      throw new HttpException(NO_ACCESS, HttpStatus.FORBIDDEN);
    }
  }
}