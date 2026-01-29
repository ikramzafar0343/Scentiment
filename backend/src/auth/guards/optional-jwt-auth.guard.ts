import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await Promise.resolve(super.canActivate(context) as any);
    } catch {
      return true;
    }
  }

  handleRequest(err: any, user: any, info: any) {
    // Don't throw error if authentication fails, just return null user
    if (err || !user) {
      return null;
    }
    return user;
  }
}
