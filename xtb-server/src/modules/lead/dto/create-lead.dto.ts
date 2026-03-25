import { IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @IsNumber()
  campaignId!: number;

  @IsNumber()
  @IsOptional()
  agentUserId?: number;

  @IsNumber()
  @IsOptional()
  studentUserId?: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsMobilePhone('zh-CN')
  mobile!: string;

  @IsString()
  @IsOptional()
  schoolName?: string;

  @IsString()
  @IsOptional()
  majorName?: string;

  @IsString()
  @IsOptional()
  gradeName?: string;

  @IsString()
  @IsOptional()
  remark?: string;
}
