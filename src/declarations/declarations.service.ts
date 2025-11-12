import { Injectable } from '@nestjs/common';
import { DeclarationStatus } from './dto/create-declaration.dto';
import { DeclarationsDatasource } from './datasource/declarationsDatasource';
import { PrismaService } from 'src/prisma.service';
import { Declaration } from './entities/declaration.entity';

@Injectable()
export class DeclarationsService extends DeclarationsDatasource {
  /**
   * DeclarationsService
   * Maneja la lógica de negocio relacionada con las declaraciones mensuales.
   * Usa PrismaService para acceder a la base de datos y expone métodos CRUD
   * y consultas específicas (buscar por mes/año, obtener estado, eliminar, etc.).
   */
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super();
  }
  /**
   * find
   * Busca la declaración de un usuario para un mes y año concretos.
   * Parámetros:
   * - year: año numérico (p.ej. 2025)
   * - month: índice de mes (0-11) compatible con Date de JavaScript
   * - userId: id del usuario propietario de la declaración
   * Devuelve la primera declaración que coincida con el rango de fechas y el usuario.
   */
  find(year: number, month: number, userId: string): Promise<Declaration | null> {
    const declaration = this.prisma.declarations.findFirst({
      where: {
        creation_date: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0),
        },
        user_id: userId,
      },
    });
    return declaration;
  }
  /**
   * create
   * Crea una nueva declaración en la base de datos. Los campos `sales_vat`,
   * `purchases_vat` y `balance` se calculan a partir de las operaciones del
   * mes/año y del usuario. Para calcular las sumas se utiliza `prisma.operations.aggregate`.
   *
   * Parámetros:
   * - data: objeto Declaration parcial con al menos `month` y `user_id`.
   * - year: año numérico usado para filtrar operaciones (opcional pero recomendado).
   * - monthIndex: índice de mes (0-11) usado para filtrar operaciones (opcional pero recomendado).
   */
  async create(data: Declaration, year?: number, monthIndex?: number): Promise<Declaration> {
    // Determinar rango de fechas para sumar las operaciones
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (year !== undefined && monthIndex !== undefined) {
      startDate = new Date(year, monthIndex, 1);
      endDate = new Date(year, monthIndex + 1, 0);
    } else if (data.month) {
      // Intentar extraer YYYY-MM si el campo month viene en ese formato
      const match = /^(\d{4})-(\d{2})$/.exec((data.month as any) || '');
      if (match) {
        const y = Number(match[1]);
        const m = Number(match[2]) - 1; // mes 0-11
        startDate = new Date(y, m, 1);
        endDate = new Date(y, m + 1, 0);
      }
    }

    const Decimal = require('@prisma/client').Decimal;

    // Sumar ventas (type: 'sale') y compras (type: 'purchase') para el usuario y rango
    let salesSum: any = null;
    let purchasesSum: any = null;
    const commonWhere: any = {
      user_id: (data as any).user_id ? (data as any).user_id : undefined,
      date: startDate && endDate ? { gte: startDate, lte: endDate } : undefined,
    };

    salesSum = await this.prisma.operations.aggregate({
      where: { ...commonWhere, type: 'sale' },
      _sum: { amount: true },
    });

    purchasesSum = await this.prisma.operations.aggregate({
      where: { ...commonWhere, type: 'purchase' },
      _sum: { amount: true },
    });

    const salesAmount = salesSum && salesSum._sum && salesSum._sum.amount ? salesSum._sum.amount : new Decimal(0);
    const purchasesAmount = purchasesSum && purchasesSum._sum && purchasesSum._sum.amount ? purchasesSum._sum.amount : new Decimal(0);
    const balanceAmount = salesAmount.minus(purchasesAmount);

    const payload: any = {
      ...data,
      sales_vat: salesAmount,
      purchases_vat: purchasesAmount,
      balance: balanceAmount,
      creation_date: (data as any).creation_date ? new Date((data as any).creation_date) : new Date(),
      updated_date: (data as any).updated_date ? new Date((data as any).updated_date) : new Date(),
    };

    const newDeclaration = await this.prisma.declarations.create({ data: payload });
    return newDeclaration;
  }
  /**
   * update
   * Actualiza el estado de las declaraciones que coincidan con el mes y año indicados.
   * Normalmente sólo habrá una declaración por usuario/mes; se utiliza updateMany
   * para cubrir el rango de fechas. Devuelve la declaración actualizada.
   * Parámetros:
   * - year, month: rango temporal
   * - declaration: objeto con el nuevo estado (p.ej. { status: 'submitted' })
   */
  async update(year: number, month: number, declaration: Declaration): Promise<Declaration | null> {
    // Buscar la declaración existente y actualizarla por id para devolver la entidad
    const found = await this.prisma.declarations.findFirst({
      where: {
        creation_date: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0),
        }
      }
    });
    if (!found) return null;
    const updated = await this.prisma.declarations.update({
      where: { id: found.id },
      data: { status: declaration.status },
    });
    return updated;
  }
  /**
   * getStatus
   * Recupera únicamente el estado (`status`) de la declaración en el mes/año indicado.
   * Útil para chequear si una declaración está `pending`, `submitted` o `accepted`.
   */
  async getStatus(year: number, month: number): Promise<DeclarationStatus> {
    const declaration = await this.prisma.declarations.findFirst({
      select: {
        status: true,
      },
      where: {
        creation_date: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0),
        },
      },
    });
    return declaration.status;
  }
  /**
   * delete
   * Elimina las declaraciones dentro del rango especificado (mes/año).
   * Devuelve la(s) declaración(es) eliminada(s). Usamos deleteMany para abarcar
   * el rango de fechas compatibles con la búsqueda por mes.
   */
  delete(year: number, month: number): Promise<Declaration | null> {
    // Buscar la declaración y eliminar por id para devolver la entidad eliminada
    return this.prisma.declarations.findFirst({
      where: {
        creation_date: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0),
        }
      }
    }).then(async (found) => {
      if (!found) return null;
      return this.prisma.declarations.delete({ where: { id: found.id } });
    });
  }
}
