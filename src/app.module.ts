import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { OperationsModule } from './operations/operations.module';

@Module({
  imports: [ConfigModule.forRoot(), OperationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
