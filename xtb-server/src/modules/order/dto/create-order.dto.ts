import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  productId!: number;

  @IsNumber()
  @IsOptional()
  campaignId?: number;

  @IsNumber()
  @IsOptional()
  agentUserId?: number;

  @IsNumber()
  @IsOptional()
  studentUserId?: number;

  @IsString()
  studentName!: string;

  @IsString()
  mobile!: string;
}
