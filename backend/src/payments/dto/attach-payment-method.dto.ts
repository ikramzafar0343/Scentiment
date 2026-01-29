import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AttachPaymentMethodDto {
  @IsString()
  paymentMethodId: string;

  @IsOptional()
  @IsBoolean()
  setAsDefault?: boolean;
}

