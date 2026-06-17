import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required on this route, let it pass
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 1. Authentication Check
    if (!user) {
      return false;
    }

    // 2. Role Check (RBAC)
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('You do not have the required role to access this resource.');
    }

    // 3. Admin Bypass: Nick Fury can see everything org-wide
    if (user.role === Role.ADMIN || user.role === 'ADMIN') {
      return true;
    }

    // 4. Bonus Objective: Country-Based Data Isolation
    // We check if the incoming request payload or parameters match the user's country
    const targetCountry = request.params.country || request.body.country || request.query.country;

    if (targetCountry && user.country) {
      if (user.country.toLowerCase() !== targetCountry.toLowerCase()) {
        throw new ForbiddenException(
          `Access Denied: As a member/manager of ${user.country}, you cannot access data for ${targetCountry}.`
        );
      }
    }

    return true;
  }
}