import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class AppLoginDto {
  @IsString()
  @IsOptional()
  account?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsIn(['agent', 'student'])
  role!: 'agent' | 'student';
}

export class AppRegisterDto {
  @IsIn(['agent', 'student'])
  role!: 'agent' | 'student';

  @IsString()
  @IsOptional()
  account?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty()
  nickname!: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

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
