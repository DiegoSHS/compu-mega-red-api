import { DeclarationStatus } from "../dto/create-declaration.dto";
import { Declaration } from "../entities/declaration.entity";

export abstract class DeclarationsDatasource {
    abstract find(year: number, month: number, userId: string): Promise<Declaration>;
    abstract create(data: Declaration): Promise<Declaration>;
    abstract update(year: number, month: number, declaration: Declaration): Promise<Declaration>;
    abstract getStatus(year: number, month: number): Promise<DeclarationStatus>;
    abstract delete(year: number, month: number): Promise<Declaration>;
}