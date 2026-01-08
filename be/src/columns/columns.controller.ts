import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ColumnsService } from "./columns.service";
import { CreateColumnDto } from "./dto/create-column.dto";
import { UpdateColumnDto } from "./dto/update-column.dto";

@ApiTags("Columns")
@Controller("columns")
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  // Get columns by project
  @ApiOperation({ summary: "Get columns of a project" })
  @Get("project/:projectId")
  getByProject(@Param("projectId") projectId: string) {
    return this.columnsService.getByProject(projectId);
  }

  // Create column
  @ApiOperation({ summary: "Create new column" })
  @Post()
  create(@Body() dto: CreateColumnDto) {
    return this.columnsService.create(dto);
  }

  // Update column (rename / reorder / close)
  @ApiOperation({ summary: "Update column" })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.columnsService.update(id, dto);
  }

  // Move column (drag & drop)
  @ApiOperation({ summary: "Move column (Drag & Drop)" })
  @Patch(":id/move")
  move(
    @Param("id") id: string,
    @Body()
    body: {
      beforeColumnId?: string;
      afterColumnId?: string;
    },
  ) {
    return this.columnsService.move(
      id,
      body.beforeColumnId,
      body.afterColumnId,
    );
  }

  // Soft delete column
  @ApiOperation({ summary: "Close column (soft delete)" })
  @Patch(":id/close")
  close(@Param("id") id: string) {
    return this.columnsService.close(id);
  }
}
