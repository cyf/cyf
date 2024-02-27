import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import logger from '@/common/logger/logger'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    logger.debug('[ResponseInterceptor]: intercept.')
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 0,
          timestamp: Date.now(),
        }
      }),
    )
  }
}
