import { Controller, Post, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { InvitesService } from './invites.service';

@Controller('invites')
export class InvitesController {
    constructor(private invitesService: InvitesService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':inviteId/accept')
    async accept(@Param('inviteId') inviteId: string, @Request() req) {
        const userId = req.user?.userId;
        return this.invitesService.acceptInvitation(inviteId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':inviteId/reject')
    async reject(@Param('inviteId') inviteId: string, @Request() req) {
        const userId = req.user?.userId;
        return this.invitesService.rejectInvitation(inviteId, userId);
    }
}
