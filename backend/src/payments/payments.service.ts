import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-06-20' as any,
      typescript: true,
    });
  }

  async createPaymentIntent(data: CreatePaymentIntentDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency ?? 'eur',
      customer: data.customerId,
      metadata: data.metadata,
      payment_method_types: ['card'],
    });

    return {
      paymentIntent: {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
      },
    };
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
    const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    const success = ['succeeded', 'processing', 'requires_capture'].includes(paymentIntent.status);
    return {
      success,
      orderId: success ? paymentIntent.id : undefined,
      status: paymentIntent.status,
    };
  }

  async getPaymentMethods() {
    return {
      paymentMethods: [],
    };
  }

  async attachPaymentMethod(paymentMethodId: string) {
    return {
      success: true,
      paymentMethodId,
    };
  }

  async detachPaymentMethod(_paymentMethodId: string) {
    return {
      success: true,
    };
  }

  async setDefaultPaymentMethod(_paymentMethodId: string) {
    return {
      success: true,
    };
  }
}
