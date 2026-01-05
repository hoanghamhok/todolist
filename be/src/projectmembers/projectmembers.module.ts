import { Module } from '@nestjs/common';
import { ProjectmembersService } from './projectmembers.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectmembersController } from './projectmembers.controller';

@Module({
  imports: [ProjectsModule, UsersModule, AuthModule, PrismaModule],
  controllers:[ProjectmembersController],
  providers: [ProjectmembersService],
  exports: [ProjectmembersService],
})
export class ProjectmembersModule {}

