import { Controller, Post, Param, Request, UseGuards,Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { InvitesService } from './invites.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateInvitationDto } from './dto/create-invite.dto';

@Controller('invites')
export class InvitesController {
    constructor(private invitesService: InvitesService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('create')
    async createInvitation(@Body() data: CreateInvitationDto) {
        return await this.invitesService.createInvite(data.inviterId, data.email,data.projectId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('accept/:token')
    async acceptInvitation(@Request() req,@Param('token') token: string) {
        return await this.invitesService.acceptInvite( token,req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('reject/:token')
    async declineInvitation(@Request() req,@Param('token') token: string) {
        return await this.invitesService.rejectInvite(req.user.id, token);
    }
}