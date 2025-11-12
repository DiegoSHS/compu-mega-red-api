import { Module } from '@nestjs/common';
import { DeclarationsService } from './declarations.service';
import { DeclarationsController } from './declarations.controller';

@Module({
  controllers: [DeclarationsController],
  providers: [DeclarationsService],
})
export class DeclarationsModule {}
