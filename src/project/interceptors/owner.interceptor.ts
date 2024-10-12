import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Project } from '../entities/project.entity';
  
  
  @Injectable()
  export class OwnerInterceptor<T extends Project>
    implements NestInterceptor<T, T>
  {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      return next.handle().pipe(
        tap(project => {
          
          if (!user) return;
  
          const userId = 
            Array.isArray(project) ? 
              project.length > 0 ? project[0].user: project.user
            :
            typeof project.user === 'object' ? project.user.id : project.user;

          const isOwner = userId === user.id;
  
          if (!isOwner) {
            throw new UnauthorizedException(`You're unauthorized to access this resources.`);
          }
        }),
      );
    }
  }