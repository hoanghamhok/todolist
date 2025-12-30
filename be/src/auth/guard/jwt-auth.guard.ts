import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    console.log('Authorization header:', req.headers.authorization);
    console.log('Incoming auth header:', req.headers['authorization']);
    console.log(' Guard triggered');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log(' User:', user);
    console.log(' Error:', err);
    console.log(' Info:', info);
    
    if (err || !user) {
      throw err || new UnauthorizedException('Token invalid');
    }
    return user;
  }
}