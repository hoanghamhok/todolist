import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

@Get()
@UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async search(@Query() query: SearchDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.searchService.search(userId, query);
  }
}