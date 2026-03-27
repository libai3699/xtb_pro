import { IsInt } from 'class-validator';

export class UpdateRedeemOrderStatusDto {
  @IsInt()
  status!: number;
}
