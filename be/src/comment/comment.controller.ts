import { Body,Controller,Delete,Get,Param,Patch,Post,Req,UseGuards} from '@nestjs/common';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('tasks/:taskId/comments')
  getTaskComments(@Param('taskId') taskId: string) {
    return this.commentsService.getTaskComments(taskId);
  }

  @Post('tasks/:taskId/comments')
  createComment(@Param('taskId') taskId: string,@Body() dto: CreateCommentDto,@Req() req,) {
    return this.commentsService.createComment(
      taskId,
      req.user.id,
      dto,
    );
  }

  @Patch('comments/:id')
  updateComment(@Param('id') id: string,@Body() dto: UpdateCommentDto,@Req() req,) {
    return this.commentsService.updateComment(
      id,
      req.user.id,
      dto,
    );
  }

  @Delete('comments/:id')
  deleteComment(@Param('id') id: string, @Req() req) {
    return this.commentsService.deleteComment(id, req.user.id);
  }
}