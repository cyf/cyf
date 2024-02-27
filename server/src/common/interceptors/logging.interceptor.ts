import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import logger from '../logger/logger'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    logger.debug('[LoggingInterceptor]: intercept.')
    const now = Date.now()
    return next
      .handle()
      .pipe(
        tap(() =>
          logger.debug(`[LoggingInterceptor]: intercept ${Date.now() - now}ms`),
        ),
      )
  }
}
