import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { SpotifyModule } from './spotify/spotify.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
    imports: [
        // Config
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // Bull Queue
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        }),

        // Feature modules
        PrismaModule,
        AuthModule,
        UsersModule,
        SpotifyModule,
        AnalyticsModule,
        JobsModule,
    ],
})
export class AppModule { }
