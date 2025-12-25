import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                spotifyId: true,
                email: true,
                displayName: true,
                profileImage: true,
                createdAt: true,
            },
        });
    }

    async findBySpotifyId(spotifyId: string) {
        return this.prisma.user.findUnique({
            where: { spotifyId },
        });
    }

    async getUserStats(userId: string) {
        const [artistCount, trackCount, historyCount] = await Promise.all([
            this.prisma.topArtist.count({ where: { userId } }),
            this.prisma.topTrack.count({ where: { userId } }),
            this.prisma.listeningHistory.count({ where: { userId } }),
        ]);

        return {
            totalArtists: artistCount,
            totalTracks: trackCount,
            totalListens: historyCount,
        };
    }

    async deleteUser(userId: string) {
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }
}
