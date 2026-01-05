import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/user/user.module';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [PrismaModule, UsersModule, ProjectsModule],
  providers: [InvitesService],
  controllers: [InvitesController],
})
export class InvitesModule {}
