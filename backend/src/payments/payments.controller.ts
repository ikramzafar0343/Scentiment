import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AttachPaymentMethodDto } from './dto/attach-payment-method.dto';
import { ConfirmPaymentIntentDto } from './dto/confirm-payment-intent.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('payment-methods')
  @ApiOperation({ summary: 'List saved payment methods' })
  @ApiResponse({ status: 200, description: 'Payment methods list.' })
  getPaymentMethods() {
    return this.paymentsService.getPaymentMethods();
  }

  @Post('payment-methods/attach')
  @ApiOperation({ summary: 'Attach a payment method to the customer' })
  @ApiResponse({ status: 200, description: 'Payment method attached.' })
  attachPaymentMethod(@Body() dto: AttachPaymentMethodDto) {
    return this.paymentsService.attachPaymentMethod(dto.paymentMethodId);
  }

  @Delete('payment-methods/:id')
  @ApiOperation({ summary: 'Detach a saved payment method' })
  @ApiResponse({ status: 200, description: 'Payment method detached.' })
  detachPaymentMethod(@Param('id') id: string) {
    return this.paymentsService.detachPaymentMethod(id);
  }

  @Patch('payment-methods/:id/default')
  @ApiOperation({ summary: 'Set default payment method' })
  @ApiResponse({ status: 200, description: 'Default payment method set.' })
  setDefaultPaymentMethod(@Param('id') id: string) {
    return this.paymentsService.setDefaultPaymentMethod(id);
  }

  @Post('payment-intents')
  @ApiOperation({ summary: 'Create a Stripe PaymentIntent' })
  @ApiResponse({ status: 201, description: 'PaymentIntent created.' })
  createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createPaymentIntent(dto);
  }

  @Post('payment-intents/:id/confirm')
  @ApiOperation({ summary: 'Confirm a Stripe PaymentIntent' })
  @ApiResponse({ status: 200, description: 'PaymentIntent confirmed.' })
  confirmPaymentIntent(@Param('id') id: string, @Body() dto: ConfirmPaymentIntentDto) {
    return this.paymentsService.confirmPaymentIntent(id, dto.paymentMethodId);
  }
}
