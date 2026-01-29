import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true, index: true })
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @Prop({ required: true })
  @ApiHideProperty()
  password?: string;

  @Prop()
  @ApiPropertyOptional({ example: 'John' })
  firstName?: string;

  @Prop()
  @ApiPropertyOptional({ example: 'Doe' })
  lastName?: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  @ApiProperty({ enum: ['user', 'admin'], example: 'user' })
  role: string;

  @Prop()
  @ApiHideProperty()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
