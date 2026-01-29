import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  metadata?: Record<string, string>;
}

