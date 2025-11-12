import { Module } from '@nestjs/common';
import { DeclarationsService } from './declarations.service';
import { DeclarationsController } from './declarations.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [DeclarationsController],
  providers: [DeclarationsService],
})
export class DeclarationsModule { }
