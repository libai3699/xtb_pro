import { IsInt } from 'class-validator';

export class RedeemRewardDto {
  @IsInt()
  userId!: number;

  @IsInt()
  goodsId!: number;
}
