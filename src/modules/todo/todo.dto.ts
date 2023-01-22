import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUpdateTodoDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}
