import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import logger from '@/common/logger/logger'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    logger.debug('[TimeoutInterceptor]: intercept.')
    return next.handle().pipe(
      timeout(30 * 1000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException())
        }
        return throwError(() => err)
      }),
    )
  }
}
