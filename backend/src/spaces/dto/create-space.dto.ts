import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SpaceType } from '@prisma/client';

export class CreateSpaceDto {
  @ApiProperty({ example: 'Sillón 1' })
  @IsString()
  name: string;

  @ApiProperty({ enum: SpaceType, example: 'CHAIR' })
  @IsEnum(SpaceType)
  spaceType: SpaceType;

  @ApiProperty({ example: 'abc123-category-uuid' })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ example: 'Sillón principal con buena luz natural' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @Min(0)
  basePriceHour: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ example: ['Sillón', 'Espejos', 'Secador'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}

export class UpdateSpaceDto extends CreateSpaceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SpaceAvailabilityDto {
  @ApiProperty({ example: 1, description: '0=Dom, 1=Lun, ..., 6=Sáb' })
  @IsInt()
  dayOfWeek: number;

  @ApiProperty({ example: '09:00' })
  @IsString()
  openTime: string;

  @ApiProperty({ example: '20:00' })
  @IsString()
  closeTime: string;
}
