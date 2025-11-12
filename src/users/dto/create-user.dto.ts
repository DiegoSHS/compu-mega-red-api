import { IsEmail, IsOptional, IsString } from 'class-validator';

export type Role = 'admin' | 'user';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    role?: Role;
}

