import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [SpotifyController],
    providers: [SpotifyService],
    exports: [SpotifyService],
})
export class SpotifyModule { }
