import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingDto } from './create-rating.dto';
import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rate?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
