import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Put, ParseIntPipe, UseGuards, Headers, ForbiddenException } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { OperationOwnerGuard } from 'src/auth/operation-owner.guard';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { UsersService } from 'src/users/users.service';

/**
 * Controlador de operaciones.
 *
 * Gestiona las rutas para crear/consultar/actualizar/eliminar operaciones.
 * El guard global (basado en header `email`) se aplica en el `AuthModule`. Aquí
 * aplicamos `RolesGuard` a nivel de clase para validar permisos por rol.
 */
@Controller('operations')
@UseGuards(RolesGuard)
export class OperationsController {
  constructor(private readonly operationsService: OperationsService, private readonly usersService: UsersService) { }

  @Post()
  @Roles('admin', 'user')
  async create(@Body() createOperationDto: CreateOperationDto, @Headers('email') email?: string) {
    // Si el email corresponde a un usuario con rol 'user', forzamos user_id a su id
    if (email) {
      const user = await this.usersService.findByEmail(email);
      if (user && user.role === 'user') {
        createOperationDto.user_id = user.id;
      }
    }
    return this.operationsService.create(createOperationDto);
  }

  @Get(':id')
  @Roles('admin', 'user')
  find(@Param('id', ParseUUIDPipe) id: string) {
    return this.operationsService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'user')
  @UseGuards(OperationOwnerGuard)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOperationDto: UpdateOperationDto) {
    return this.operationsService.updateOne(id, updateOperationDto);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  @UseGuards(OperationOwnerGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.operationsService.deleteOne(id);
  }

  @Get(':year/:month')
  @Roles('admin', 'user')
  async findByYearAndMonth(@Param('year', ParseIntPipe) year: number, @Param('month', ParseIntPipe) month: number, @Headers('email') email?: string) {
    // si el email corresponde a un usuario con rol 'user', sólo devuelve sus propias operaciones
    if (email) {
      const user = await this.usersService.findByEmail(email);
      if (user && user.role === 'user') {
        return this.operationsService.findByYearAndMonth(year, month, user.id);
      }
    }
    return this.operationsService.findByYearAndMonth(year, month);
  }
  @Get('sales')
  @Roles('admin', 'user')
  async getSales(@Headers('email') email?: string) {
    if (email) {
      const user = await this.usersService.findByEmail(email);
      if (user && user.role === 'user') return this.operationsService.getSales(user.id);
    }
    return this.operationsService.getSales();
  }

  @Get('purchases')
  @Roles('admin', 'user')
  async getPurchases(@Headers('email') email?: string) {
    if (email) {
      const user = await this.usersService.findByEmail(email);
      if (user && user.role === 'user') return this.operationsService.getPurchases(user.id);
    }
    return this.operationsService.getPurchases();
  }
}