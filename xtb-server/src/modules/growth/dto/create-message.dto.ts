import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  userId!: number;

  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  bizType?: string;

  @IsOptional()
  @IsInt()
  bizId?: number;
}
