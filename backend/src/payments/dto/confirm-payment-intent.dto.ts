import { IsString } from 'class-validator';

export class ConfirmPaymentIntentDto {
  @IsString()
  paymentMethodId: string;
}

