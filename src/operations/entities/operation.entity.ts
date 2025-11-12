import { Decimal } from "@prisma/client/runtime/library";

export class Operation {
    type: 'sale' | 'purchase';
    amount: Decimal;
    date: Date;
    user_id: string;
    declaration_id?: string;
}
