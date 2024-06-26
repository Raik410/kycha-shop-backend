import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  perPage?: string;
}

export class OrderByWithPagination extends PaginationDto {
  @IsString()
  @IsOptional()
  orderBy?: 'deshc' | 'asc';
}
