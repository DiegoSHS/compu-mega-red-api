import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { PrismaService } from 'src/prisma.service';
import { OperationsDatasource } from './datasource/operationsDatasource';
import { Operation } from './entities/operation.entity';
import { Decimal } from '@prisma/client/runtime/library';
/**
 * OperationsService
 * Se encarga de manejar las operaciones CRUD relacionadas con las operaciones financieras.
 * Utiliza PrismaService para interactuar con la base de datos.
 */
@Injectable()
export class OperationsService extends OperationsDatasource {
  constructor(
    private readonly prisma: PrismaService
  ) {
    super();
  }
  /**
   * Crea una operación transformando los campos del DTO a los tipos esperados
   * por Prisma (amount -> Decimal, date -> Date).
   */
  create(data: CreateOperationDto): Promise<Operation> {
    const payload: any = {
      ...data,
      amount: new Decimal(Number(data.amount)),
      date: new Date(data.date as any),
    };
    const operation = this.prisma.operations.create({
      data: payload,
    });
    return operation;
  }
  findOne(id: string): Promise<Operation> {
    const operation = this.prisma.operations.findUnique({
      where: { id }
    })
    return operation
  }
  deleteOne(id: string): Promise<Operation> {
    const operation = this.prisma.operations.delete({
      where: { id }
    })
    return operation
  }
  findByYearAndMonth(year: number, month: number, userId?: string): Promise<Operation[]> {
    const filter = {
      date: {
        gte: new Date(year, month, 1),
        lte: new Date(year, month, 31)
      }
    }
    const operations = this.prisma.operations.findMany({
      where: {
        user_id: userId ? userId : undefined,
        date: filter.date
      }
    })
    return operations
  }
  getPurchases(userId?: string): Promise<Operation[]> {
    const purchases = this.prisma.operations.findMany({
      where: {
        type: 'purchase',
        user_id: userId ? userId : undefined
      }
    })
    return purchases
  }
  getSales(userId?: string): Promise<Operation[]> {
    const sales = this.prisma.operations.findMany({
      where: {
        type: 'sale',
        user_id: userId ? userId : undefined
      }
    })
    return sales
  }
  /**
   * Actualiza una operación. Acepta un partial del DTO y transforma campos
   * cuando sea necesario antes de persistir.
   */
  updateOne(id: string, data: Partial<CreateOperationDto>): Promise<Operation> {
    const payload: any = { ...data };
    if (payload.amount !== undefined) payload.amount = new Decimal(Number(payload.amount));
    if (payload.date !== undefined) payload.date = new Date(payload.date as any);

    const operation = this.prisma.operations.update({
      where: { id },
      data: payload,
    });
    return operation;
  }
}
