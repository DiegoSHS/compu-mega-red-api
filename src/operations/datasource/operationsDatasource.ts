import { Operation } from "../entities/operation.entity";

export abstract class OperationsDatasource {
    abstract create(data: Operation): Promise<Operation>;
    abstract findOne(id: string): Promise<Operation[]>;
    abstract updateOne(id: string, data: Partial<Operation>): Promise<Operation>;
    abstract deleteOne(id: string): Promise<Operation>;
    abstract findByYearAndMonth(year: number, month: number): Promise<Operation[]>;
    abstract getSales(): Promise<Operation[]>;
    abstract getPurchases(): Promise<Operation[]>;
}