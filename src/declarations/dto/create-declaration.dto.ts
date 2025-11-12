import { Decimal } from "@prisma/client/runtime/library";
import { IsIn, IsOptional, IsString, IsNumber, Min, IsUUID, IsISO8601, Length } from 'class-validator';

export type DeclarationStatus = 'pending' | 'submitted' | 'accepted';

/**
 * DTO para crear una declaración.
 * Se validan los tipos según el esquema Prisma: month (YYYY-MM), montos como números
 * (se convertirá a Decimal en el servicio), status dentro del enum y user_id UUID.
 */
export class CreateDeclarationDto {
    @IsString()
    @Length(7, 7, { message: 'month debe tener formato YYYY-MM' })
    month: string;

    // Los campos calculados `sales_vat`, `purchases_vat` y `balance` no deben
    // ser provistos por el cliente al crear la declaración. Se calculan en el
    // servidor a partir de las operaciones del mes/año del usuario.

    @IsOptional()
    @IsISO8601()
    creation_date?: string;

    @IsOptional()
    @IsISO8601()
    updated_date?: string;

    @IsIn(['pending', 'submitted', 'accepted'])
    status: DeclarationStatus;

    @IsUUID('4')
    user_id: string;
}
