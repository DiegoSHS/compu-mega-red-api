import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Put, ParseIntPipe } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) { }

  @Post()
  create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationsService.create(createOperationDto);
  }

  @Get(':id')
  find(@Param('id', ParseUUIDPipe) id: string) {
    return this.operationsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOperationDto: UpdateOperationDto) {
    return this.operationsService.updateOne(id, updateOperationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.operationsService.deleteOne(id);
  }

  @Get(':year/:month')
  findByYearAndMonth(@Param('year', ParseIntPipe) year: number, @Param('month', ParseIntPipe) month: number) {
    return this.operationsService.findByYearAndMonth(year, month);
  }
  @Get('sales')
  getSales() {
    return this.operationsService.getSales();
  }
  @Get('purchases')
  getPurchases() {
    return this.operationsService.getPurchases();
  }
}