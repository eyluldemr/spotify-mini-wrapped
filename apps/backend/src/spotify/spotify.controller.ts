import { Controller, Get, Post, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SpotifyService } from './spotify.service';
import { TimeRange } from '@prisma/client';

@ApiTags('spotify')
@Controller('spotify')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class SpotifyController {
    constructor(private spotifyService: SpotifyService) { }

    @Get('top-artists')
    @ApiOperation({ summary: 'Get top artists for a time range' })
    @ApiQuery({ name: 'timeRange', enum: TimeRange })
    async getTopArtists(
        @Req() req: any,
        @Query('timeRange') timeRange: TimeRange = TimeRange.MEDIUM_TERM,
    ) {
        return this.spotifyService.getTopArtists(req.user.id, timeRange);
    }

    @Get('top-tracks')
    @ApiOperation({ summary: 'Get top tracks for a time range' })
    @ApiQuery({ name: 'timeRange', enum: TimeRange })
    async getTopTracks(
        @Req() req: any,
        @Query('timeRange') timeRange: TimeRange = TimeRange.MEDIUM_TERM,
    ) {
        return this.spotifyService.getTopTracks(req.user.id, timeRange);
    }

    @Get('recently-played')
    @ApiOperation({ summary: 'Get recently played tracks' })
    @ApiQuery({ name: 'limit', required: false })
    async getRecentlyPlayed(
        @Req() req: any,
        @Query('limit') limit?: string,
    ) {
        return this.spotifyService.getRecentlyPlayed(
            req.user.id,
            limit ? parseInt(limit, 10) : 50,
        );
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh all Spotify data for current user' })
    async refreshData(@Req() req: any) {
        return this.spotifyService.refreshAllData(req.user.id);
    }

    @Post('fetch/top-artists')
    @ApiOperation({ summary: 'Fetch and save top artists from Spotify' })
    @ApiQuery({ name: 'timeRange', enum: TimeRange })
    async fetchTopArtists(
        @Req() req: any,
        @Query('timeRange') timeRange: TimeRange = TimeRange.MEDIUM_TERM,
    ) {
        return this.spotifyService.fetchAndSaveTopArtists(req.user.id, timeRange);
    }

    @Post('fetch/top-tracks')
    @ApiOperation({ summary: 'Fetch and save top tracks from Spotify' })
    @ApiQuery({ name: 'timeRange', enum: TimeRange })
    async fetchTopTracks(
        @Req() req: any,
        @Query('timeRange') timeRange: TimeRange = TimeRange.MEDIUM_TERM,
    ) {
        return this.spotifyService.fetchAndSaveTopTracks(req.user.id, timeRange);
    }

    @Post('fetch/recently-played')
    async fetchRecentlyPlayed(@Req() req: any) {
        const count = await this.spotifyService.fetchAndSaveRecentlyPlayed(req.user.id);
        return { newTracksAdded: count };
    }

    @Post('create-playlist')
    @ApiQuery({ name: 'timeRange', enum: TimeRange })
    @ApiQuery({ name: 'name', required: false })
    async createPlaylist(
        @Req() req: any,
        @Query('timeRange') timeRange: TimeRange = TimeRange.MEDIUM_TERM,
        @Query('name') name?: string,
    ) {
        return this.spotifyService.createPlaylistFromTopTracks(req.user.id, timeRange, name);
    }
}

