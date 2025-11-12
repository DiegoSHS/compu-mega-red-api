import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    message: string;
    error: string | null;
    data: T;
}
/**
 * Interceptor para formatear las respuestas exitosas de las rutas HTTP
 * en una estructura consistente que incluye mensaje, datos y error (null en caso de éxito).
 */
@Injectable()
export class FormattedResponseInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next
            .handle()
            .pipe(
                map((data) => ({
                    message: 'Success',
                    error: null,
                    data: data
                })),
            );
    }
}

