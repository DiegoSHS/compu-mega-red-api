import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
/**
 * Filtro global para capturar todas las excepciones no manejadas
 * y devolver una respuesta JSON consistente.
*/
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        console.log('Excepción capturada por AllExceptionsFilter:', exception);

        // Manejo específico para errores de Prisma (constraints únicas P2002)
        try {
            const exAny = exception as any;
            if (exAny && typeof exAny === 'object' && exAny.code === 'P2002') {
                const target = exAny.meta && exAny.meta.target ? exAny.meta.target : null;
                const campos = Array.isArray(target) ? target.join(', ') : target || 'campo(s)';
                response.statusCode = HttpStatus.CONFLICT;
                return response.send({
                    message: `Registro duplicado`,
                    data: null,
                    error: 'Duplicado',
                });
            }

            // Errores de tipo en tiempo de ejecución
            if (exception instanceof TypeError) {
                response.statusCode = HttpStatus.BAD_REQUEST;
                return response.send({
                    message: `Error de tipo o dato inválido: ${(exception as Error).message}`,
                    data: null,
                    error: 'Error de tipo',
                });
            }
        } catch (err) {
            // Si hay algún problema al inspeccionar la excepción, seguimos con el flujo general
            console.error('Error inspeccionando la excepción en AllExceptionsFilter', err);
        }

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Error interno del servidor';
        const errorMessage =
            typeof message === 'string'
                ? message
                : (message as any).message || 'Error interno del servidor';
        response.statusCode = status;
        response.send({
            message: errorMessage,
            data: null,
            error: 'Algo salió mal',
        });
    }
}