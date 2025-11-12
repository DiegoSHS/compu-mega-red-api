import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

/**
 * DeclarationOwnerGuard
 *
 * Verifica en la base de datos que la declaración para year+month pertenece
 * al usuario cuyo email está en el header `email`. Se usa para rutas que reciben
 * year y month como parámetros.
 */
@Injectable()
export class DeclarationOwnerGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const headerEmail = (req.headers && (req.headers['email'] || req.headers['Email'])) || undefined;
        if (!headerEmail) return false;
        const email = Array.isArray(headerEmail) ? headerEmail[0] : headerEmail;

        const user = await this.prisma.users.findUnique({ where: { email: String(email) } });
        if (!user) return false;

        if (user.role === 'admin') return true;

        const year = Number(req.params?.year);
        const month = Number(req.params?.month);
        if (!Number.isInteger(year) || !Number.isInteger(month)) return false;

        // Buscar declaración por rango de fechas (coincide con la lógica del servicio)
        const found = await this.prisma.declarations.findFirst({
            where: {
                creation_date: {
                    gte: new Date(year, month, 1),
                    lte: new Date(year, month + 1, 0),
                }
            },
            select: { user_id: true }
        });

        if (!found) throw new ForbiddenException('Declaración no encontrada');

        const owner = await this.prisma.users.findUnique({ where: { id: found.user_id }, select: { email: true } });
        if (!owner) throw new ForbiddenException('Usuario propietario no encontrado');

        if (owner.email !== email) throw new ForbiddenException('No tienes permiso sobre esta declaración');
        return true;
    }
}
