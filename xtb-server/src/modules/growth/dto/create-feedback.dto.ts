import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsString()
  content!: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  contact?: string;
}
