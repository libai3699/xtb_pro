import { IsInt, IsString } from 'class-validator';

export class UpdateAppPasswordDto {
  @IsInt()
  userId!: number;

  @IsString()
  oldPassword!: string;

  @IsString()
  newPassword!: string;
}
