// tasks.module.ts
import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ColumnsController } from './columns.controller';

@Module({
  imports: [PrismaModule],
  providers: [ColumnsService],
  exports: [ColumnsService],
  controllers:[ColumnsController]
})
export class ColumnsModule {}
