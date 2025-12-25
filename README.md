# Spotify Mini Wrapped 🎵

Kişisel Spotify dinleme istatistiklerini gösteren modern bir dashboard uygulaması.

## Özellikler

- 🔐 Spotify OAuth 2.0 ile güvenli giriş
- 🎤 Top Artists (4 hafta / 6 ay / tüm zamanlar)
- 🎵 Top Tracks (4 hafta / 6 ay / tüm zamanlar)
- 📊 Genre dağılımı analizi
- 🆕 Bu ay keşiflerim
- 🔄 Otomatik veri güncelleme (background jobs)
- ⚡ Redis cache ile hızlı yanıtlar

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + TypeScript + TailwindCSS |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + Prisma |
| Cache | Redis |
| Queue | Bull |

## Kurulum

### 1. Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Spotify Developer Account

### 2. Spotify Developer Setup

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)'a git
2. Yeni bir uygulama oluştur
3. Client ID ve Client Secret'ı kopyala
4. Redirect URI ekle: `http://localhost:3000/api/auth/callback/spotify`

### 3. Installation

```bash
# Clone repo
git clone <repo-url>
cd spotify-mini-wrapped

# Install dependencies
npm install

# Start PostgreSQL & Redis
docker-compose up -d

# Setup environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
# Edit .env files with your Spotify credentials

# Run database migrations
cd apps/backend && npx prisma migrate dev

# Start development servers
npm run dev
```

### 4. Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

## Project Structure

```
spotify-mini-wrapped/
├── apps/
│   ├── backend/        # NestJS API
│   └── frontend/       # Next.js Dashboard
├── docker-compose.yml  # PostgreSQL + Redis
└── package.json        # Monorepo root
```

## License

MIT
