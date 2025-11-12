import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, UseGuards, Headers } from '@nestjs/common';
import { DeclarationsService } from './declarations.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { DeclarationOwnerGuard } from 'src/auth/declaration-owner.guard';
import { CreateDeclarationDto, DeclarationStatus } from './dto/create-declaration.dto';
import { getMonthName } from 'src/utils';
import { Declaration } from './entities/declaration.entity';
import { UsersService } from 'src/users/users.service';

/**
 * Controlador de declaraciones.
 *
 * Provee las rutas para generar, consultar y administrar declaraciones. El
 * guard global (basado en header `email`) se aplica en el `AuthModule`; aquí
 * aplicamos `RolesGuard` a nivel de clase para gestionar permisos por rol.
 */
@Controller('declaration')
@UseGuards(RolesGuard)
export class DeclarationsController {
  constructor(private readonly declarationsService: DeclarationsService, private readonly usersService: UsersService) { }

  @Get(":year/:month")
  @Roles('admin', 'user')
  async findAll(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Headers('email') email?: string,
  ) {
    let userId = '';
    if (email) {
      const user = await this.usersService.findByEmail(email);
      if (user && user.role === 'user') userId = user.id;
    }
    return this.declarationsService.find(year, month, userId);
  }

  @Post(":year/:month/generate")
  @Roles('admin', 'user')
  async create(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Body() createDeclarationDto: CreateDeclarationDto,
    @Headers('email') email?: string,
  ) {
    let userId = '';
    if (email) {
      const user = await this.usersService.findByEmail(email);
      if (user) userId = user.id;
    }
    const newDeclaration = {
      ...createDeclarationDto,
      month: getMonthName(month),
      user_id: userId,
    }
    return this.declarationsService.create(newDeclaration);
  }

  @Put(':year/:month/status/:status')
  @Roles('admin', 'user')
  @UseGuards(DeclarationOwnerGuard)
  update(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Param('status') status: DeclarationStatus,
  ) {
    return this.declarationsService.update(year, month, { status } as Declaration);
  }

  @Get(':year/:month/status')
  @Roles('admin', 'user')
  findOne(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.declarationsService.getStatus(year, month);
  }

  @Delete(':year/:month/delete')
  @Roles('admin', 'user')
  @UseGuards(DeclarationOwnerGuard)
  remove(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.declarationsService.delete(year, month);
  }
}
