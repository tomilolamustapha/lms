import { AuthGuard } from '@nestjs/passport';

export class UserGuard extends AuthGuard('user-jwt') {
  constructor() {
    super();
  }
}
