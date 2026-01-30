import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopifyOrderDocument = ShopifyOrderRecord & Document;

@Schema({ timestamps: true, versionKey: false })
export class ShopifyOrderRecord {
  @Prop({ required: true, unique: true, index: true })
  id!: string;

  @Prop({ required: true, index: true })
  orderNumber!: string;

  @Prop({ index: true })
  customerEmail?: string;

  @Prop({ required: true })
  status!: string;

  @Prop({ 
    type: { amount: String, currencyCode: String },
    required: true 
  })
  total!: { amount: string; currencyCode: string };

  @Prop({ type: [{ title: String, quantity: Number, price: Object, productId: String }], default: [] })
  items!: Array<{ title: string; quantity: number; price: { amount: string; currencyCode: string }; productId?: string }>;

  @Prop({ index: true })
  shopifyCreatedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ShopifyOrderSchema = SchemaFactory.createForClass(ShopifyOrderRecord);

