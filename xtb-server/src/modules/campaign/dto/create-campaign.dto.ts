import { IsDateString, IsIn, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  campaignType?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  targetCount?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  requirement?: string;

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
