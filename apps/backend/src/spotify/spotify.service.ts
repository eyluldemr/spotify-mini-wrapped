import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { TimeRange } from '@prisma/client';
import axios from 'axios';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

interface SpotifyArtist {
    id: string;
    name: string;
    genres: string[];
    popularity: number;
    images: { url: string }[];
}

interface SpotifyTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    preview_url: string | null;
    duration_ms: number;
}

interface RecentlyPlayedItem {
    track: SpotifyTrack;
    played_at: string;
}

@Injectable()
export class SpotifyService {
    private readonly logger = new Logger(SpotifyService.name);

    constructor(
        private prisma: PrismaService,
        private authService: AuthService,
    ) { }

    private async getValidAccessToken(userId: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if token is expired or about to expire (5 min buffer)
        if (user.tokenExpiresAt < new Date(Date.now() + 5 * 60 * 1000)) {
            const refreshed = await this.authService.refreshSpotifyToken(userId);
            if (!refreshed) {
                throw new Error('Failed to refresh token');
            }
            // Get updated token
            const updatedUser = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            return updatedUser!.accessToken;
        }

        return user.accessToken;
    }

    private async spotifyRequest<T>(
        userId: string,
        endpoint: string,
        params?: Record<string, string>,
    ): Promise<T> {
        const accessToken = await this.getValidAccessToken(userId);

        const url = new URL(`${SPOTIFY_API_BASE}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const response = await axios.get<T>(url.toString(), {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    }

    private mapTimeRange(range: TimeRange): string {
        const mapping = {
            [TimeRange.SHORT_TERM]: 'short_term',
            [TimeRange.MEDIUM_TERM]: 'medium_term',
            [TimeRange.LONG_TERM]: 'long_term',
        };
        return mapping[range];
    }

    async fetchAndSaveTopArtists(userId: string, timeRange: TimeRange) {
        this.logger.log(`Fetching top artists for user ${userId}, range: ${timeRange}`);

        const data = await this.spotifyRequest<{ items: SpotifyArtist[] }>(
            userId,
            '/me/top/artists',
            {
                time_range: this.mapTimeRange(timeRange),
                limit: '50',
            },
        );

        // Delete existing entries for this time range
        await this.prisma.topArtist.deleteMany({
            where: { userId, timeRange },
        });

        // Insert new entries
        const artists = data.items.map((artist, index) => ({
            userId,
            spotifyId: artist.id,
            name: artist.name,
            imageUrl: artist.images[0]?.url || null,
            genres: artist.genres,
            popularity: artist.popularity,
            timeRange,
            rank: index + 1,
        }));

        await this.prisma.topArtist.createMany({ data: artists });

        return artists;
    }

    async fetchAndSaveTopTracks(userId: string, timeRange: TimeRange) {
        this.logger.log(`Fetching top tracks for user ${userId}, range: ${timeRange}`);

        const data = await this.spotifyRequest<{ items: SpotifyTrack[] }>(
            userId,
            '/me/top/tracks',
            {
                time_range: this.mapTimeRange(timeRange),
                limit: '50',
            },
        );

        // Delete existing entries for this time range
        await this.prisma.topTrack.deleteMany({
            where: { userId, timeRange },
        });

        // Insert new entries
        const tracks = data.items.map((track, index) => ({
            userId,
            spotifyId: track.id,
            name: track.name,
            artistName: track.artists.map((a) => a.name).join(', '),
            albumName: track.album.name,
            albumImage: track.album.images[0]?.url || null,
            previewUrl: track.preview_url,
            durationMs: track.duration_ms,
            timeRange,
            rank: index + 1,
        }));

        await this.prisma.topTrack.createMany({ data: tracks });

        return tracks;
    }

    async fetchAndSaveRecentlyPlayed(userId: string) {
        this.logger.log(`Fetching recently played for user ${userId}`);

        const data = await this.spotifyRequest<{ items: RecentlyPlayedItem[] }>(
            userId,
            '/me/player/recently-played',
            { limit: '50' },
        );

        // Get existing history to avoid duplicates
        const existingPlayedAt = await this.prisma.listeningHistory.findMany({
            where: { userId },
            select: { playedAt: true },
            orderBy: { playedAt: 'desc' },
            take: 100,
        });

        const existingTimes = new Set(
            existingPlayedAt.map((h) => h.playedAt.toISOString()),
        );

        // Filter out duplicates and insert new entries
        const newItems = data.items.filter(
            (item) => !existingTimes.has(item.played_at),
        );

        if (newItems.length > 0) {
            const history = newItems.map((item) => ({
                userId,
                trackId: item.track.id,
                trackName: item.track.name,
                artistName: item.track.artists.map((a) => a.name).join(', '),
                albumImage: item.track.album.images[0]?.url || null,
                playedAt: new Date(item.played_at),
            }));

            await this.prisma.listeningHistory.createMany({ data: history });
        }

        return newItems.length;
    }

    async getTopArtists(userId: string, timeRange: TimeRange) {
        return this.prisma.topArtist.findMany({
            where: { userId, timeRange },
            orderBy: { rank: 'asc' },
        });
    }

    async getTopTracks(userId: string, timeRange: TimeRange) {
        return this.prisma.topTrack.findMany({
            where: { userId, timeRange },
            orderBy: { rank: 'asc' },
        });
    }

    async getRecentlyPlayed(userId: string, limit = 50) {
        return this.prisma.listeningHistory.findMany({
            where: { userId },
            orderBy: { playedAt: 'desc' },
            take: limit,
        });
    }

    async refreshAllData(userId: string) {
        this.logger.log(`Refreshing all data for user ${userId}`);

        const timeRanges = [TimeRange.SHORT_TERM, TimeRange.MEDIUM_TERM, TimeRange.LONG_TERM];

        await Promise.all([
            ...timeRanges.map((range) => this.fetchAndSaveTopArtists(userId, range)),
            ...timeRanges.map((range) => this.fetchAndSaveTopTracks(userId, range)),
            this.fetchAndSaveRecentlyPlayed(userId),
        ]);

        return { success: true };
    }

    async createPlaylistFromTopTracks(userId: string, timeRange: TimeRange, name?: string) {
        const accessToken = await this.getValidAccessToken(userId);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        if (!user) throw new Error('User not found');

        const tracks = await this.getTopTracks(userId, timeRange);
        if (tracks.length === 0) {
            throw new Error('No tracks to add');
        }

        const timeRangeLabel = {
            [TimeRange.SHORT_TERM]: 'Son 4 Hafta',
            [TimeRange.MEDIUM_TERM]: 'Son 6 Ay',
            [TimeRange.LONG_TERM]: 'Tüm Zamanlar',
        }[timeRange];

        const playlistName = name || `Mini Wrapped - ${timeRangeLabel}`;
        const playlistDesc = `${timeRangeLabel} en çok dinlediğim şarkılar • Mini Wrapped`;

        const createRes = await axios.post(
            `${SPOTIFY_API_BASE}/users/${user.spotifyId}/playlists`,
            { name: playlistName, description: playlistDesc, public: false },
            { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
        );

        const playlistId = createRes.data.id;
        const trackUris = tracks.slice(0, 50).map(t => `spotify:track:${t.spotifyId}`);

        await axios.post(
            `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`,
            { uris: trackUris },
            { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
        );

        return {
            playlistId,
            playlistUrl: createRes.data.external_urls.spotify,
            trackCount: trackUris.length,
            name: playlistName
        };
    }
}

