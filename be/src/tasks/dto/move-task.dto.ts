import { IsString,IsOptional,IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MoveTaskDto{

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    columnId:string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    beforeTaskId:string;
    
    @IsOptional()
    @IsString()
    @ApiProperty()
    afterTaskId:string;

}

