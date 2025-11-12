import { Decimal } from "@prisma/client/runtime/library";

export class CreateOperationDto {
    type: 'sale' | 'purchase';
    amount: Decimal;
    date: Date;
    user_id: string;
    declaration_id?: string;
}
