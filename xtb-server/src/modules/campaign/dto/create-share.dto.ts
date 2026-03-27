import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateShareDto {
  @IsInt()
  campaignId!: number;

  @IsInt()
  agentUserId!: number;

  @IsOptional()
  @IsString()
  shareUrl?: string;
}
