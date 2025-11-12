import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { DeclarationsService } from './declarations.service';
import { CreateDeclarationDto, DeclarationStatus } from './dto/create-declaration.dto';
import { UpdateDeclarationDto } from './dto/update-declaration.dto';
import { getMonthName } from 'src/utils';
import { Declaration } from './entities/declaration.entity';

@Controller('declaration')
export class DeclarationsController {
  constructor(private readonly declarationsService: DeclarationsService) { }

  @Get(":year/:month")
  findAll(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number
  ) {
    return this.declarationsService.find(year, month, '');
  }

  @Post(":year/:month/generate")
  create(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Body() createDeclarationDto: CreateDeclarationDto
  ) {
    const newDeclaration = {
      ...createDeclarationDto,
      month: getMonthName(month),
    }
    return this.declarationsService.create(newDeclaration);
  }

  @Put(':year/:month/status/:status')
  update(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Param('status') status: DeclarationStatus,
  ) {
    return this.declarationsService.update(year, month, { status } as Declaration);
  }

  @Get(':year/:month/status')
  findOne(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number
  ) {
    return this.declarationsService.getStatus(year, month);
  }

  @Delete(':year/:month/delete')
  remove(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number
  ) {
    return this.declarationsService.delete(year, month);
  }
}
