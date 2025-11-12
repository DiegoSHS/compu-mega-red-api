import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [OperationsController],
  providers: [OperationsService, PrismaService],
})
export class OperationsModule { }
