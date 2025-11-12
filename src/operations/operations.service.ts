import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { PrismaService } from 'src/prisma.service';
import { OperationsDatasource } from './datasource/operationsDatasource';
import { Operation } from './entities/operation.entity';
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
  create(data: CreateOperationDto): Promise<Operation> {
    const operation = this.prisma.operations.create({
      data
    })
    return operation
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
  findByYearAndMonth(year: number, month: number): Promise<Operation[]> {
    const operations = this.prisma.operations.findMany({
      where: {
        date: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month, 31)
        }
      }
    })
    return operations
  }
  getPurchases(): Promise<Operation[]> {
    const purchases = this.prisma.operations.findMany({
      where: {
        type: 'purchase'
      }
    })
    return purchases
  }
  getSales(): Promise<Operation[]> {
    const sales = this.prisma.operations.findMany({
      where: {
        type: 'sale'
      }
    })
    return sales
  }
  updateOne(id: string, data: Partial<Operation>): Promise<Operation> {
    const operation = this.prisma.operations.update({
      where: { id },
      data
    })
    return operation
  }
}
