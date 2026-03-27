import { IsIn, IsOptional, IsString } from 'class-validator';

export class SaveContentArticleDto {
  @IsIn(['news', 'help'])
  type!: 'news' | 'help';

  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  sort?: number;

  @IsOptional()
  status?: number;

  @IsOptional()
  publishedAt?: string;
}
