import { Decimal } from "@prisma/client/runtime/library";

export type DeclarationStatus = 'pending' | 'submitted' | 'accepted';

export class CreateDeclarationDto {
    month: string;
    sales_vat: Decimal;
    purchases_vat: Decimal;
    balance: Decimal;
    creation_date?: Date;
    updated_date?: Date;
    status: DeclarationStatus;
    user_id: string;
}
