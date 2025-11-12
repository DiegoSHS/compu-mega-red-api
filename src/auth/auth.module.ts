import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma.module';
import { RolesGuard } from './roles.guard';
import { OperationOwnerGuard } from './operation-owner.guard';
import { DeclarationOwnerGuard } from './declaration-owner.guard';
import { APP_GUARD } from '@nestjs/core';
import { EmailAuthGuard } from './email-auth.guard';

/**
 * Módulo de autenticación.
 *
 * NOTA: El guard de autenticación global se registra mediante APP_GUARD y
 * acepta el header HTTP `email` como único mecanismo de identificación. Las
 * rutas públicas pueden marcarse con el decorador @Public().
 */
@Module({
    imports: [UsersModule, PrismaModule],
    providers: [
        RolesGuard,
        // Guards de ownership basados en DB
        OperationOwnerGuard,
        DeclarationOwnerGuard,
        // Guard global que exige header 'email'
        { provide: APP_GUARD, useClass: EmailAuthGuard },
    ],
    controllers: [],
    exports: [],
})
export class AuthModule { }
