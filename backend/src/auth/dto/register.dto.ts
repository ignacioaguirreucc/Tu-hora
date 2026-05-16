import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail({}, { message: 'Ingresá un email válido' })
  email: string;

  @ApiPropertyOptional({ example: '+5491123456789' })
  @IsOptional()
  @Matches(/^[+\d][\d\s().-]{7,}$/, { message: 'Ingresá un teléfono válido' })
  phone?: string;

  @ApiPropertyOptional({ example: '38123456' })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiProperty({ example: 'MiPass123!' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsString()
  password: string;
}
