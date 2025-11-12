import { Decimal } from "@prisma/client/runtime/library";
import { IsIn, IsNumber, IsNotEmpty, IsOptional, IsUUID, IsISO8601, NotEquals } from 'class-validator';

/**
 * DTO para crear una operación.
 *
 * Validaciones:
 * - `type` debe ser 'sale' o 'purchase'.
 * - `amount` debe ser un número distinto de 0 (maximo 2 decimales).
 * - `date` debe ser una cadena ISO8601.
 * - `user_id` debe ser un UUID válido.
 * - `declaration_id` es opcional y si se proporciona debe ser UUID.
 */
export class CreateOperationDto {
    @IsIn(['sale', 'purchase'], { message: 'type debe ser "sale" o "purchase"' })
    type: 'sale' | 'purchase';

    // Usamos number en DTO para recibir el valor desde el request. El service
    // puede transformarlo a Decimal si es necesario antes de persistir.
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'amount debe ser un número con hasta 2 decimales' })
    @NotEquals(0, { message: 'amount no puede ser 0' })
    amount: number | Decimal;

    @IsISO8601({ strict: true }, { message: 'date debe ser una fecha ISO8601 válida' })
    date: string;

    @IsUUID('4', { message: 'user_id debe ser un UUID válido' })
    user_id: string;

    @IsOptional()
    @IsUUID('4', { message: 'declaration_id debe ser un UUID válido' })
    declaration_id?: string;
}
