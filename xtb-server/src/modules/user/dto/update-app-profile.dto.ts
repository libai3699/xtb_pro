import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAppProfileDto {
  @IsInt()
  userId!: number;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  realName?: string;

  @IsOptional()
  @IsString()
  schoolName?: string;

  @IsOptional()
  @IsString()
  majorName?: string;

  @IsOptional()
  @IsString()
  gradeName?: string;

  @IsOptional()
  @IsString()
  inviteCode?: string;
}
