import { ProjectmembersService } from './projectmembers.service';
import {Controller,Get,Patch,Post,Delete,Request,Body, Param, UseGuards} from '@nestjs/common';
import { InviteMemberDto } from './dto/invite-member.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('projectmembers')
export class ProjectmembersController {
    constructor(private projectmembersService:ProjectmembersService){}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':projectId/members')
    async getProjectMembers(@Param('projectId') projectId: string) {
            return this.projectmembersService.getProjectMembers(projectId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post(':projectId/invite')
    async invite(
        @Param('projectId') projectId: string,
        @Request() req,
        @Body() body: InviteMemberDto,
    ) {
        const inviterId = req.user?.userId;
        return this.projectmembersService.inviteMembers(projectId, inviterId, body);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':projectId/members/:userId')
    async removeMember(
        @Param('projectId') projectId: string,
        @Param('userId') userId: string,
        @Request() req,
    ) {
        const requesterId = req.user?.userId;
        return this.projectmembersService.removeMember(projectId, requesterId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post(':projectId/leave')
    async leaveProject(
        @Param('projectId') projectId: string,
        @Request() req,
    ) {
        const requesterId = req.user?.userId;
        return this.projectmembersService.leaveProject(projectId, requesterId);
    }
}
