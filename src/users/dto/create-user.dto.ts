import { IsEmail, IsOptional, IsString, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export type Role = 'admin' | 'user';

export class CreateUserDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;

    @IsEmail({}, { message: 'El correo debe ser una dirección de email válida' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsOptional()
    @IsIn(['admin', 'user'], { message: 'role debe ser "admin" o "user"' })
    role?: Role;
}

