import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.body.createdAt = 'test';

    // const createdAt = request.usert;
    return next.handle().pipe(
      map((value) => {
        value.createdAt = 'test';
        return value;
      }),
    );
  }
}
