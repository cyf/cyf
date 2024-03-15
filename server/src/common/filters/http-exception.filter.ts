import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { Request } from 'express'
import logger from '../logger/logger'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    logger.error('http exception', exception)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest() as Request
    const statusCode = exception.getStatus()

    response.status(statusCode).json({
      code: exception.getStatus(),
      msg: (exception.getResponse() as any)?.message || exception.message,
      timestamp: Date.now(),
      path: request.originalUrl,
    })
  }
}
