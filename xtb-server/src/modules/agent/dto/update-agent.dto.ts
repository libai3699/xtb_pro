import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateAgentDto {
  @IsString()
  @IsOptional()
  account?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  realName?: string;

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
  inviteCode?: string;

  @IsIn([0, 1, 2])
  @IsOptional()
  status?: 0 | 1 | 2;

  @IsString()
  @IsOptional()
  avatar?: string;
}
