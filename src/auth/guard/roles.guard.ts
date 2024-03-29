import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());

    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (this.isAdministrator(user.role)) return true;

    return this.isAllowed(user.role, roles);
  }

  private isAdministrator(role: Role): boolean {
    return role === Role.ADMIN;
  }

  private isAllowed(userRole: Role, roles: Role[]): boolean {
    return roles.some((role) => role === userRole);
  }
}
