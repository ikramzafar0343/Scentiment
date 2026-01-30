import { Controller, Get, Post, Body, Param, Query, Put, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'The order has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid payload.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(req.user.id, req.user.email, createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders for the authenticated user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] })
  @ApiResponse({ status: 200, description: 'Return all orders for the user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ): Promise<Order[]> {
    // Customers can only see their own orders
    // Order management is handled via Shopify Admin Store
    return this.ordersService.findAll(page, limit, req.user.id, status);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by id' })
  @ApiParam({ name: 'id', description: 'Shopify order GID (e.g., gid://shopify/Order/123)' })
  @ApiResponse({ status: 200, description: 'Return the order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Request() req: any, @Param('id') id: string): Promise<Order> {
    // Customers can only see their own orders
    // Order management is handled via Shopify Admin Store
    return this.ordersService.findOne(id, req.user.id);
  }

}
