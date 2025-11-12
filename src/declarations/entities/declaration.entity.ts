import { Decimal } from "@prisma/client/runtime/library";

export class Declaration {
    month: string;
    sales_vat: Decimal;
    purchases_vat: Decimal;
    balance: Decimal;
    creation_date?: Date;
    updated_date?: Date;
    status: 'pending' | 'submitted' | 'accepted';
    user_id: string;
}
