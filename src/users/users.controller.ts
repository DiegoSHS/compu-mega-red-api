import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Public } from 'src/auth/public.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Controlador de usuarios
 *
 * Rutas relacionadas con la gestión de usuarios. El guard global basado en el
 * header `email` se aplica en el `AuthModule` (APP_GUARD), por lo que no es
 * necesario declarar autenticación en cada ruta. Aquí sólo usamos `RolesGuard`
 * para controlar permisos por rol.
 */
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Post()
  @Public()
  /**
   * Crea un nuevo usuario.
   *
   * Esta ruta es pública para permitir registro/autocreación de cuentas sin
   * necesidad de un administrador o token previo. Forzamos el rol a 'user'
   * para evitar escalación de privilegios desde el cliente.
   */
  create(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = 'user';
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  /**
   * Devuelve un usuario por id. Los usuarios con rol `user` sólo pueden acceder
   * a su propio recurso (ownership), lo comprueba RolesGuard.
   */
  findOne(@Param('id') id: string, @Request() req) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(id);
  }
}
