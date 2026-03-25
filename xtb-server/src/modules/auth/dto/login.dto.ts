import { IsIn, IsNotEmpty, IsString } from 'class-validator';

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
