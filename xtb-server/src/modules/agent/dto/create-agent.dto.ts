import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  @IsNotEmpty()
  account!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  nickname!: string;

  @IsString()
  @IsNotEmpty()
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  realName!: string;

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
