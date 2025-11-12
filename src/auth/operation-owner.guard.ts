import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

/**
 * OperationOwnerGuard
 *
 * Verifica en la base de datos que la operación identificada por el parámetro
 * `id` pertenece al usuario cuyo email está presente en el header `email`.
 * - Permite el acceso si el usuario tiene rol `admin`.
 * - Si no se encuentra la operación o el owner no coincide, lanza ForbiddenException.
 */
@Injectable()
export class OperationOwnerGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const headerEmail = (req.headers && (req.headers['email'] || req.headers['Email'])) || undefined;
        if (!headerEmail) return false;
        const email = Array.isArray(headerEmail) ? headerEmail[0] : headerEmail;

        const user = await this.prisma.users.findUnique({ where: { email: String(email) } });
        if (!user) return false;

        // Admin bypass
        if (user.role === 'admin') return true;

        const id = req.params?.id;
        if (!id) return false;

        const operation = await this.prisma.operations.findUnique({
            where: { id },
            select: { user_id: true },
        });
        if (!operation) throw new ForbiddenException('Operación no encontrada');

        const owner = await this.prisma.users.findUnique({ where: { id: operation.user_id }, select: { email: true } });
        if (!owner) throw new ForbiddenException('Usuario propietario no encontrado');

        if (owner.email !== email) throw new ForbiddenException('No tienes permiso sobre esta operación');
        return true;
    }
}
