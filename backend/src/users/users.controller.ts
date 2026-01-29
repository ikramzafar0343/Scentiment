import { Controller } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: 'Users controller (endpoints TBD)' })
  // This controller is currently a placeholder; endpoints can be added without affecting existing routes.
  // Intentionally left minimal to preserve current API behavior.
  noop() {
    return;
  }
}
