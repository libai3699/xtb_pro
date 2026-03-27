import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsInt()
  userId!: number;

  @IsOptional()
  @IsInt()
  productId?: number;

  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  issuer?: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsOptional()
  issuedAt?: string;

  @IsOptional()
  @IsInt()
  status?: number;
}
