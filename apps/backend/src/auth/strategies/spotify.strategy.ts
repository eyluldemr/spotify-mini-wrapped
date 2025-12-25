import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-spotify';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
    constructor(
        private authService: AuthService,
        configService: ConfigService,
    ) {
        super({
            clientID: configService.get('SPOTIFY_CLIENT_ID'),
            clientSecret: configService.get('SPOTIFY_CLIENT_SECRET'),
            callbackURL: configService.get('SPOTIFY_CALLBACK_URL'),
            scope: [
                'user-read-email',
                'user-read-private',
                'user-top-read',
                'user-read-recently-played',
                'playlist-modify-private',
                'playlist-modify-public',
            ],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ): Promise<any> {
        console.log('Spotify login for:', profile.displayName, profile.id);

        const user = await this.authService.validateSpotifyUser(profile, {
            accessToken,
            refreshToken,
            expiresIn: 3600, // Default 1 hour
        });
        return user;
    }
}

