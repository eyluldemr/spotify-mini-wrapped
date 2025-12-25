import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { SpotifyModule } from './spotify/spotify.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { JobsModule } from './jobs/jobs.module';

const imports = [
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SpotifyModule,
    AnalyticsModule,
];

if (process.env.REDIS_HOST) {
    imports.push(
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        }) as any,
        JobsModule as any,
    );
}

@Module({
    imports,
})
export class AppModule { }

