import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { PrismaService } from 'src/prisma.service';

/**
 * RolesGuard
 *
 * Comprueba la metadata @Roles(...) en controladores o métodos y permite o deniega
 * el acceso según el rol del usuario identificado por el header `email`.
 * - Si no hay metadata de roles, por defecto permite la ejecución (se asume que
 *   la ruta sólo requiere autenticación, que la gestiona el guard global `EmailAuthGuard`).
 * - Los usuarios con rol `admin` tienen bypass total.
 * - Para el rol `user` se aplica una comprobación básica de propiedad: compara
 *   el email provisto en el header `email` con el email identificado.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Si no hay metadata de roles, permitimos (el guard JWT global ya protege autenticación)
        if (!requiredRoles) return true;

        const req = context.switchToHttp().getRequest();
        const headerEmail = (req.headers && (req.headers['email'] || req.headers['Email'])) || undefined;

        // Debemos tener el header 'email' para autenticar
        if (!headerEmail) return false;
        const email = Array.isArray(headerEmail) ? headerEmail[0] : headerEmail;

        // Resolvemos el usuario desde la BD (necesario para comprobar rol)
        const user = await this.prisma.users.findUnique({ where: { email: String(email) } }) as any;
        if (!user) return false;

        // Admin puede todo
        if (user.role === 'admin') return true;

        // Si la metadata permite 'user', aplicar verificación de propiedad basada en email
        if (requiredRoles.includes('user')) {
            // Si se proporcionó headerEmail, ya lo tenemos y coincide con user.email
            if (String(email) === user.email) return true;

            // También permitimos que el email venga en params o body (ej.: /users/:email)
            const paramEmail = req.params?.email || req.params?.userEmail;
            if (paramEmail && paramEmail === user.email) return true;
            const bodyEmail = req.body?.email || req.body?.userEmail;
            if (bodyEmail && bodyEmail === user.email) return true;
        }

        return false;
    }
}
