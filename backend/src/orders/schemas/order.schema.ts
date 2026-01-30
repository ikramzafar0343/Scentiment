import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Order model shape used by the API layer.
 *
 * This project treats Shopify as the source of truth for orders. The Orders module does not
 * register this schema with Mongoose, so it is used primarily for typing and Swagger docs.
 *
 * Note: IDs in order APIs are typically Shopify GIDs (e.g. `gid://shopify/Order/123`), not ObjectIds.
 */
export type OrderDocument = Order & Document;

class OrderItem {
  @Prop({ required: true })
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  productId: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'Diffuser Air 2' })
  productName: string;

  @Prop({ required: true })
  @ApiProperty({ example: 59.99 })
  price: number;

  @Prop({ required: true })
  @ApiProperty({ example: 2 })
  quantity: number;

  @Prop()
  @ApiPropertyOptional({ example: 'https://placehold.co/600x400?text=Diffuser+Air+2' })
  image?: string;
}

@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({ required: true, index: true })
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  userId: string;

  @Prop({ required: true })
  @ApiProperty({ example: 'user@example.com' })
  userEmail: string;

  @Prop({ type: [OrderItem], required: true })
  @ApiProperty({ type: [OrderItem], description: 'Order items' })
  items: OrderItem[];

  @Prop({ required: true })
  @ApiProperty({ example: 119.98 })
  subtotal: number;

  @Prop({ default: 0 })
  @ApiPropertyOptional({ example: 10.00 })
  shipping: number;

  @Prop({ default: 0 })
  @ApiPropertyOptional({ example: 5.00 })
  tax: number;

  @Prop({ required: true })
  @ApiProperty({ example: 134.98 })
  total: number;

  @Prop({ default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] })
  @ApiProperty({ example: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] })
  status: string;

  @Prop()
  @ApiPropertyOptional({ example: 'John Doe' })
  shippingName?: string;

  @Prop()
  @ApiPropertyOptional({ example: '123 Main St' })
  shippingAddress?: string;

  @Prop()
  @ApiPropertyOptional({ example: 'New York' })
  shippingCity?: string;

  @Prop()
  @ApiPropertyOptional({ example: 'NY' })
  shippingState?: string;

  @Prop()
  @ApiPropertyOptional({ example: '10001' })
  shippingZip?: string;

  @Prop()
  @ApiPropertyOptional({ example: 'US' })
  shippingCountry?: string;

  @Prop()
  @ApiPropertyOptional({ example: 'Order notes or special instructions' })
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes for efficient queries
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });
