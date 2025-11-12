export class CreateOperationDto {
    type: 'sale' | 'purchase';
    amount: number;
    date: Date;
    user_id: string;
    declaration_id?: string;
}
