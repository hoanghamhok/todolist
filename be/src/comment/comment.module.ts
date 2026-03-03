import { Module } from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CommentsController } from './comment.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService],
})
export class CommentsModule {}