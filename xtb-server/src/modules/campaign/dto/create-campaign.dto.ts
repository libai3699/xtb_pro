import { IsDateString, IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  formConfig?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  rewardDesc?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsIn([0, 1, 2])
  @IsOptional()
  status?: 0 | 1 | 2;
}
