import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsIn(['agent', 'student'])
  @IsOptional()
  role?: 'agent' | 'student';

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  account?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsIn([0, 1])
  @IsOptional()
  status?: 0 | 1;

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
}
