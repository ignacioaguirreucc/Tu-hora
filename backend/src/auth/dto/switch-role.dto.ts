import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class SwitchRoleDto {
  @ApiProperty({ enum: UserRole, example: 'PROFESSIONAL' })
  @IsEnum(UserRole, { message: 'Rol inválido' })
  role: UserRole;
}
