import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorador para marcar rutas públicas (exentas del guard global `EmailAuthGuard`).
 * Úsalo en controladores o métodos: @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
