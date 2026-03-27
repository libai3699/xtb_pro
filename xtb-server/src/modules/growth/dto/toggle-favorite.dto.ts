import { IsIn, IsInt } from 'class-validator';

export class ToggleFavoriteDto {
  @IsInt()
  userId!: number;

  @IsIn(['campaign', 'article'])
  targetType!: 'campaign' | 'article';

  @IsInt()
  targetId!: number;
}
