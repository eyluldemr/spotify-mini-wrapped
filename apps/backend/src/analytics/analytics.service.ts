import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TimeRange } from '@prisma/client';

export interface GenreDistribution {
    genre: string;
    count: number;
    percentage: number;
}

export interface DiscoveryItem {
    trackId: string;
    trackName: string;
    artistName: string;
    albumImage: string | null;
    firstPlayedAt: Date;
    playCount: number;
}

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getGenreDistribution(userId: string, timeRange: TimeRange = TimeRange.MEDIUM_TERM): Promise<GenreDistribution[]> {
        const artists = await this.prisma.topArtist.findMany({
            where: { userId, timeRange },
            select: { genres: true, rank: true },
        });

        // Count genre occurrences (weighted by artist rank - higher ranked = more weight)
        const genreCounts = new Map<string, number>();

        artists.forEach((artist) => {
            const weight = Math.max(1, 51 - artist.rank); // Rank 1 = weight 50, Rank 50 = weight 1
            artist.genres.forEach((genre) => {
                genreCounts.set(genre, (genreCounts.get(genre) || 0) + weight);
            });
        });

        // Sort by count and get top 15
        const sortedGenres = Array.from(genreCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15);

        const totalWeight = sortedGenres.reduce((sum, [, count]) => sum + count, 0);

        return sortedGenres.map(([genre, count]) => ({
            genre,
            count,
            percentage: Math.round((count / totalWeight) * 100 * 10) / 10,
        }));
    }

    async getMonthlyDiscoveries(userId: string): Promise<DiscoveryItem[]> {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        // Get all tracks played in the last month
        const recentHistory = await this.prisma.listeningHistory.findMany({
            where: {
                userId,
                playedAt: { gte: oneMonthAgo },
            },
            orderBy: { playedAt: 'asc' },
        });

        // Get tracks before one month ago (to determine what's "new")
        const olderTracks = await this.prisma.listeningHistory.findMany({
            where: {
                userId,
                playedAt: { lt: oneMonthAgo },
            },
            select: { trackId: true },
        });

        const olderTrackIds = new Set(olderTracks.map((t) => t.trackId));

        // Find tracks that were first played in the last month
        const discoveries = new Map<string, { item: typeof recentHistory[0]; count: number; firstPlayed: Date }>();

        recentHistory.forEach((item) => {
            if (!olderTrackIds.has(item.trackId)) {
                const existing = discoveries.get(item.trackId);
                if (!existing) {
                    discoveries.set(item.trackId, { item, count: 1, firstPlayed: item.playedAt });
                } else {
                    existing.count++;
                }
            }
        });

        // Sort by play count and return top 20
        return Array.from(discoveries.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 20)
            .map(({ item, count, firstPlayed }) => ({
                trackId: item.trackId,
                trackName: item.trackName,
                artistName: item.artistName,
                albumImage: item.albumImage,
                firstPlayedAt: firstPlayed,
                playCount: count,
            }));
    }

    async getDashboardStats(userId: string) {
        const [topArtistShort, topTrackShort, recentHistory, genreDistribution] = await Promise.all([
            this.prisma.topArtist.findFirst({
                where: { userId, timeRange: TimeRange.SHORT_TERM, rank: 1 },
            }),
            this.prisma.topTrack.findFirst({
                where: { userId, timeRange: TimeRange.SHORT_TERM, rank: 1 },
            }),
            this.prisma.listeningHistory.count({ where: { userId } }),
            this.getGenreDistribution(userId, TimeRange.SHORT_TERM),
        ]);

        return {
            topArtist: topArtistShort ? {
                name: topArtistShort.name,
                image: topArtistShort.imageUrl,
            } : null,
            topTrack: topTrackShort ? {
                name: topTrackShort.name,
                artist: topTrackShort.artistName,
                image: topTrackShort.albumImage,
            } : null,
            totalListens: recentHistory,
            topGenre: genreDistribution[0]?.genre || null,
            genreCount: genreDistribution.length,
        };
    }
}
