import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { TimeRange } from '@prisma/client';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    @Get('genres')
    @ApiOperation({ summary: 'Get genre distribution' })
    @ApiQuery({ name: 'timeRange', enum: TimeRange, required: false })
    async getGenreDistribution(
        @Req() req: any,
        @Query('timeRange') timeRange?: TimeRange,
    ) {
        return this.analyticsService.getGenreDistribution(
            req.user.id,
            timeRange || TimeRange.MEDIUM_TERM,
        );
    }

    @Get('discoveries')
    @ApiOperation({ summary: 'Get monthly discoveries - new tracks discovered this month' })
    async getDiscoveries(@Req() req: any) {
        return this.analyticsService.getMonthlyDiscoveries(req.user.id);
    }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get dashboard summary stats' })
    async getDashboardStats(@Req() req: any) {
        return this.analyticsService.getDashboardStats(req.user.id);
    }
}
