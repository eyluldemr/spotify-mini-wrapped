import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export interface SpotifyProfile {
    id: string;
    displayName: string;
    emails?: { value: string }[];
    photos?: { value: string }[];
}

export interface SpotifyTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateSpotifyUser(
        profile: any,
        tokens: SpotifyTokens,
    ) {
        this.logger.log('Profile received:', JSON.stringify(profile, null, 2));

        // Handle different profile structures
        const spotifyId = profile.id || profile._json?.id;
        const displayName = profile.displayName || profile._json?.display_name || 'Spotify User';
        const email = profile.emails?.[0]?.value || profile._json?.email;
        const profileImage = profile.photos?.[0]?.value || profile._json?.images?.[0]?.url;

        if (!spotifyId) {
            this.logger.error('No Spotify ID found in profile');
            throw new Error('Invalid Spotify profile: no ID found');
        }

        // Calculate token expiration time (default 1 hour if not provided)
        const expiresIn = tokens.expiresIn || 3600;
        const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

        this.logger.log(`Creating/updating user with spotifyId: ${spotifyId}`);

        // Upsert user
        const user = await this.prisma.user.upsert({
            where: { spotifyId },
            update: {
                displayName,
                email,
                profileImage,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                tokenExpiresAt,
            },
            create: {
                spotifyId,
                displayName,
                email,
                profileImage,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                tokenExpiresAt,
            },
        });

        return user;
    }

    generateJwt(userId: string) {
        return this.jwtService.sign({ sub: userId });
    }

    async validateJwtPayload(payload: { sub: string }) {
        return this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
    }

    async refreshSpotifyToken(userId: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) return false;

        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(
                        `${this.configService.get('SPOTIFY_CLIENT_ID')}:${this.configService.get('SPOTIFY_CLIENT_SECRET')}`,
                    ).toString('base64')}`,
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: user.refreshToken,
                }),
            });

            if (!response.ok) return false;

            const data = await response.json();

            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token || user.refreshToken,
                    tokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
                },
            });

            return true;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            return false;
        }
    }
}
