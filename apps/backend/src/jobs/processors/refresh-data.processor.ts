import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SpotifyService } from '../../spotify/spotify.service';

@Processor('spotify-refresh')
export class RefreshDataProcessor {
    private readonly logger = new Logger(RefreshDataProcessor.name);

    constructor(private spotifyService: SpotifyService) { }

    @Process('refresh-user-data')
    async handleRefresh(job: Job<{ userId: string }>) {
        const { userId } = job.data;
        this.logger.log(`Processing refresh job for user ${userId}`);

        try {
            await this.spotifyService.refreshAllData(userId);
            this.logger.log(`Successfully refreshed data for user ${userId}`);
            return { success: true };
        } catch (error) {
            this.logger.error(`Failed to refresh data for user ${userId}:`, error);
            throw error;
        }
    }
}
