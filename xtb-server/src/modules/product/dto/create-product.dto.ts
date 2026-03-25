import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  campaignId!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

