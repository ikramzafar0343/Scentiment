import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get analytics data' })
  @ApiQuery({ name: 'period', required: false, enum: ['today', 'week', 'month', 'quarter', 'year', 'all'], description: 'Time period for analytics' })
  @ApiResponse({ status: 200, description: 'Return analytics data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getAnalytics(@Query('period') period: string = 'month') {
    const validPeriods = ['today', 'week', 'month', 'quarter', 'year', 'all'];
    const periodValue = validPeriods.includes(period) ? period : 'month';
    return this.analyticsService.getAnalytics(periodValue as any);
  }
}
