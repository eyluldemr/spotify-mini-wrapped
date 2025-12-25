-- CreateEnum
CREATE TYPE "TimeRange" AS ENUM ('SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "profileImage" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopArtist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "genres" TEXT[],
    "popularity" INTEGER NOT NULL,
    "timeRange" "TimeRange" NOT NULL,
    "rank" INTEGER NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopTrack" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "albumName" TEXT NOT NULL,
    "albumImage" TEXT,
    "previewUrl" TEXT,
    "durationMs" INTEGER,
    "timeRange" "TimeRange" NOT NULL,
    "rank" INTEGER NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListeningHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "trackName" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "albumImage" TEXT,
    "playedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListeningHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_spotifyId_key" ON "User"("spotifyId");

-- CreateIndex
CREATE INDEX "TopArtist_userId_timeRange_idx" ON "TopArtist"("userId", "timeRange");

-- CreateIndex
CREATE INDEX "TopTrack_userId_timeRange_idx" ON "TopTrack"("userId", "timeRange");

-- CreateIndex
CREATE INDEX "ListeningHistory_userId_playedAt_idx" ON "ListeningHistory"("userId", "playedAt");

-- AddForeignKey
ALTER TABLE "TopArtist" ADD CONSTRAINT "TopArtist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopTrack" ADD CONSTRAINT "TopTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListeningHistory" ADD CONSTRAINT "ListeningHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
