import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Draw } from './draw.entity';
  
  
  @Injectable()
  export class OwnerInterceptor<T extends Draw>
    implements NestInterceptor<T, T>
  {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      return next.handle().pipe(
        tap(draw => {
          
          if (!user) return;
  
          const userId = 
            Array.isArray(draw) ? 
              draw.length > 0 ? draw[0].user: draw.user
            :
            typeof draw.user === 'object' ? draw.user.id : draw.user;

          const isOwner = userId === user.id;
  
          if (!isOwner) {
            throw new UnauthorizedException(`You're unauthorized to access this resources.`);
          }
        }),
      );
    }
  }