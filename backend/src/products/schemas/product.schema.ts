import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Product model shape used by the API layer.
 *
 * This project treats Shopify as the source of truth for products. The Products module does not
 * register this schema with Mongoose, so it is used primarily for typing and Swagger docs.
 *
 * Note: when coming from Shopify, `_id` is typically a Shopify GID (e.g. `gid://shopify/Product/123`).
 */
export type ProductDocument = Product & Document;

class FlashSale {
  @Prop()
  @ApiPropertyOptional({ example: 'STORM' })
  code: string;

  @Prop()
  @ApiPropertyOptional({ example: '2026-01-29T12:00:00.000Z' })
  endTime: string;
}

@Schema({ timestamps: true, versionKey: false, suppressReservedKeysWarning: true })
export class Product {
  @Prop({ required: true, index: true })
  @ApiProperty({ example: 'Diffuser Air 2' })
  name: string;

  @Prop({ required: true })
  @ApiProperty({ example: 59.99 })
  price: number;

  @Prop({ required: true })
  @ApiProperty({ example: 'https://placehold.co/600x400?text=Diffuser+Air+2' })
  image: string;

  @Prop({ required: true, index: true })
  @ApiProperty({ example: 'Diffusers' })
  category: string;

  @Prop({ default: false })
  @ApiPropertyOptional({ example: false })
  isNew?: boolean;

  @Prop({ type: FlashSale })
  @ApiPropertyOptional({ type: FlashSale })
  flashSale?: FlashSale;

  @Prop()
  @ApiPropertyOptional({ example: 'Covers up to 1,000 sqft. Pairs 120 mL Fragrance Oil' })
  description?: string;

  @Prop({ index: true })
  @ApiPropertyOptional({ example: 5 })
  rating?: number;

  @Prop({ default: 0 })
  @ApiPropertyOptional({ example: 320 })
  reviews?: number;

  @Prop()
  @ApiPropertyOptional({ example: 200 })
  originalPrice?: number;

  @Prop()
  @ApiPropertyOptional({ example: 140 })
  saveAmount?: number;

  @Prop()
  @ApiPropertyOptional({ example: 'SALE' })
  badge?: string;

  @Prop([String])
  @ApiPropertyOptional({ type: [String], example: ['Black', 'Silver', 'White'] })
  variants?: string[];

  @Prop()
  @ApiPropertyOptional({ example: 'Add to Cart' })
  customButtonText?: string;

  @Prop()
  @ApiPropertyOptional({ example: 'Mini Diffusers' })
  subCategory?: string;

  @Prop({ default: 0 })
  @ApiPropertyOptional({ example: 100 })
  stock?: number;

  @Prop({ default: 'active' })
  @ApiPropertyOptional({ example: 'active', enum: ['active', 'pending', 'approved', 'rejected', 'draft', 'inactive'] })
  status?: string;

  @Prop({ type: Object })
  @ApiPropertyOptional({ example: { 'Black': 'https://...', 'Silver': 'https://...' } })
  variantImages?: Record<string, string>;

  @Prop([String])
  @ApiPropertyOptional({ type: [String], example: ['https://...', 'https://...'] })
  images?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ rating: -1 });
