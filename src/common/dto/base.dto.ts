import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class ErrorResponse {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  stack?: string;
  message?: any;
  name?: string;
}

export class SuccessResponse {
  success = true;
  status = 'OK';
  data: any;
  constructor(data) {
    this.data = data;
  }
}

export interface SuccessDto<T> {
  success: boolean;
  status: string;
  data: T;
}

export interface TokenPayload {
  _id: string | Types.ObjectId;
  email: string;
  name: string;
  type: string;
}

export class PaginationDTO {
  @ApiPropertyOptional()
  @IsOptional()
  page_size?: string;

  @ApiPropertyOptional()
  @IsOptional()
  page_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  sort_by?: string;

  @ApiPropertyOptional()
  @IsOptional()
  ascending?: string;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  _id?: string;
}
