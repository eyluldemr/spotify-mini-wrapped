import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsService } from './jobs.service';
import { RefreshDataProcessor } from './processors/refresh-data.processor';
import { SpotifyModule } from '../spotify/spotify.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'spotify-refresh',
        }),
        SpotifyModule,
    ],
    providers: [JobsService, RefreshDataProcessor],
    exports: [JobsService],
})
export class JobsModule { }
