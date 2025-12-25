import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
    private readonly logger = new Logger(JobsService.name);

    constructor(
        @InjectQueue('spotify-refresh') private refreshQueue: Queue,
        private prisma: PrismaService,
    ) { }

    async scheduleUserRefresh(userId: string, delay = 0) {
        await this.refreshQueue.add(
            'refresh-user-data',
            { userId },
            {
                delay,
                removeOnComplete: true,
                removeOnFail: false,
            },
        );
        this.logger.log(`Scheduled refresh for user ${userId}`);
    }

    async scheduleAllUsersRefresh() {
        const users = await this.prisma.user.findMany({
            select: { id: true },
        });

        for (let i = 0; i < users.length; i++) {
            // Stagger jobs by 5 seconds to avoid rate limiting
            await this.scheduleUserRefresh(users[i].id, i * 5000);
        }

        this.logger.log(`Scheduled refresh for ${users.length} users`);
        return { scheduledUsers: users.length };
    }

    async getQueueStats() {
        const [waiting, active, completed, failed] = await Promise.all([
            this.refreshQueue.getWaitingCount(),
            this.refreshQueue.getActiveCount(),
            this.refreshQueue.getCompletedCount(),
            this.refreshQueue.getFailedCount(),
        ]);

        return { waiting, active, completed, failed };
    }
}
