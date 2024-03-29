import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { Role } from 'src/common/enums/rol.enum';
import { ROLES_KEY } from './roles.decorators';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';

export function Auth(...role: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, role),
    UseGuards(AuthGuard, RolesGuard),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
