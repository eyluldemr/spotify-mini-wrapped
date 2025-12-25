import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @Get('spotify')
    @UseGuards(AuthGuard('spotify'))
    @ApiOperation({ summary: 'Initiate Spotify OAuth flow' })
    spotifyLogin() {
        // Passport handles redirect to Spotify
    }

    @Get('spotify/callback')
    @UseGuards(AuthGuard('spotify'))
    @ApiOperation({ summary: 'Spotify OAuth callback' })
    async spotifyCallback(@Req() req: any, @Res() res: Response) {
        const user = req.user;
        const jwt = this.authService.generateJwt(user.id);

        // Set JWT as HTTP-only cookie
        res.cookie('auth_token', jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Redirect to frontend dashboard
        const frontendUrl = this.configService.get('FRONTEND_URL');
        res.redirect(`${frontendUrl}/dashboard`);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get current user profile' })
    async getCurrentUser(@Req() req: any) {
        const { accessToken, refreshToken, ...user } = req.user;
        return user;
    }

    @Get('logout')
    @ApiOperation({ summary: 'Logout user' })
    logout(@Res() res: Response) {
        res.clearCookie('auth_token');
        const frontendUrl = this.configService.get('FRONTEND_URL');
        res.redirect(frontendUrl || '/');
    }
}
