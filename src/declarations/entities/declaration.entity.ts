import { Decimal } from "@prisma/client/runtime/library";

export class Declaration {
    month: string;
    // Permitimos number | Decimal en la entidad para facilitar la interoperabilidad
    // entre DTOs (que usan number) y Prisma (que usa Decimal).
    sales_vat?: number | Decimal;
    purchases_vat?: number | Decimal;
    balance?: number | Decimal;
    creation_date?: string | Date;
    updated_date?: string | Date;
    status: 'pending' | 'submitted' | 'accepted';
    user_id: string;
}
