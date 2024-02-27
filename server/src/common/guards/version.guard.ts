import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { satisfies, validate } from 'compare-versions'

@Injectable()
export class VersionGuard implements CanActivate {
  constructor(private readonly match: string) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const version = request.headers['x-version']
    if (this.match && validate(version) && !satisfies(version, this.match)) {
      throw new NotFoundException(
        `API version mismatch, the requested version number is ${version}.`,
      )
    }

    return true
  }
}
