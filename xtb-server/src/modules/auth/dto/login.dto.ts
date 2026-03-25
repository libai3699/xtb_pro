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
  @IsNotEmpty()
  code!: string;

  @IsIn(['agent', 'student'])
  role!: 'agent' | 'student';
}

export class AppRegisterDto {
  @IsIn(['agent', 'student'])
  role!: 'agent' | 'student';

  @IsString()
  @IsNotEmpty()
  nickname!: string;

  @IsString()
  @IsNotEmpty()
  mobile!: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
