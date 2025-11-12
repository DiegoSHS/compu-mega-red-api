import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { UsersService } from 'src/users/users.service';

/**
 * EmailAuthGuard
 * - Autentica peticiones protegidas mediante el header HTTP `email`.
 * - Si la ruta está marcada con @Public() permite el acceso.
 * - Verifica que el email exista en la base de datos. NO adjunta datos en `req.user`.
 */
@Injectable()
export class EmailAuthGuard implements CanActivate {
    constructor(private reflector: Reflector, private usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const req = context.switchToHttp().getRequest();
        const headerEmail = (req.headers && (req.headers['email'] || req.headers['Email'])) || undefined;
        if (!headerEmail) return false;

        const email = Array.isArray(headerEmail) ? headerEmail[0] : headerEmail;
        const user = await this.usersService.findByEmail(String(email));
        if (!user) return false;
        return true;
    }
}
