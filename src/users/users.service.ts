import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils/password';

/**
 * UsersService
 * Implementa operaciones CRUD básicas para el recurso Users usando Prisma.
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateUserDto): Promise<User> {
    const hashed = await hashPassword(data.password as any);
    const payload = { ...data, password: hashed } as any;
    return this.prisma.users.create({ data: payload });
  }

  findAll(): Promise<User[]> {
    return this.prisma.users.findMany();
  }

  findOne(id: string): Promise<User | null> {
    return this.prisma.users.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.users.findUnique({ where: { email } });
  }

  update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.users.update({ where: { id }, data });
  }

  remove(id: string): Promise<User> {
    return this.prisma.users.delete({ where: { id } });
  }
}
