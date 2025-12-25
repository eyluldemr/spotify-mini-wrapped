import { Controller, Get, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    async getProfile(@Req() req: any) {
        return this.usersService.findById(req.user.id);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get user statistics' })
    async getStats(@Req() req: any) {
        return this.usersService.getUserStats(req.user.id);
    }

    @Delete('account')
    @ApiOperation({ summary: 'Delete user account and all data' })
    async deleteAccount(@Req() req: any) {
        await this.usersService.deleteUser(req.user.id);
        return { message: 'Account deleted successfully' };
    }
}
