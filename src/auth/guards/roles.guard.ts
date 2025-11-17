import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from 'generated/prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lê os papéis necessários do "rótulo" @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Se a rota não tiver o rótulo @Roles(), ela é pública
    if (!requiredRoles) {
      return true;
    }

    // 3. Pega o objeto 'user' que o JwtAuthGuard anexou à requisição
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { user } = context.switchToHttp().getRequest();

    // 4. Compara o papel do usuário com os papéis necessários
    const isAdmin = user.role === 'ADMIN';
    return requiredRoles.some((role) => role === user.role) || isAdmin;
  }
}
