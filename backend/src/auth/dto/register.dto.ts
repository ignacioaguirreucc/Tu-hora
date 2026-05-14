import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail({}, { message: 'Ingresá un email válido' })
  email: string;

  @ApiPropertyOptional({ example: '+5491123456789' })
  @IsOptional()
  @Matches(/^[+\d][\d\s().-]{7,}$/, { message: 'Ingresá un teléfono válido' })
  phone?: string;

  @ApiProperty({ example: 'MiPass123!' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole, example: 'CLIENT' })
  @IsEnum(UserRole)
  role: UserRole;
}
