import { IsInt, IsOptional, IsString } from 'class-validator';

export class SaveRewardGoodsDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsInt()
  points?: number;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsInt()
  sort?: number;

  @IsOptional()
  @IsInt()
  status?: number;
}
