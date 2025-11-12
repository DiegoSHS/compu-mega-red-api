import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { OperationsModule } from './operations/operations.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), OperationsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
