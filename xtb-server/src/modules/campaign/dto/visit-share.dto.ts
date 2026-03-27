import { IsInt } from 'class-validator';

export class VisitShareDto {
  @IsInt()
  campaignId!: number;

  @IsInt()
  agentUserId!: number;
}
