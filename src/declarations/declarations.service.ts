import { Injectable } from '@nestjs/common';
import { CreateDeclarationDto, DeclarationStatus } from './dto/create-declaration.dto';
import { UpdateDeclarationDto } from './dto/update-declaration.dto';
import { DeclarationsDatasource } from './datasource/declarationsDatasource';
import { PrismaService } from 'src/prisma.service';
import { Declaration } from './entities/declaration.entity';

@Injectable()
export class DeclarationsService extends DeclarationsDatasource {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super();
  }
  find(year: number, month: number, userId: string): Promise<Declaration> {
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
  create(data: Declaration): Promise<Declaration> {
    const newDeclaration = this.prisma.declarations.create({
      data,
    });
    return newDeclaration;
  }
  update(year: number, month: number, declaration: Declaration): Promise<Declaration> {
    const updatedDeclaration = this.prisma.declarations.updateMany({
      where: {
        creation_date: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0),
        }
      },
      data: {
        status: declaration.status,
      }
    })
    return updatedDeclaration[0];
  }
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
  delete(year: number, month: number): Promise<Declaration> {
    const deletedDeclaration = this.prisma.declarations.deleteMany({
      where: {
        creation_date: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0),
        }
      },
    })
    return deletedDeclaration[0];
  }
}
