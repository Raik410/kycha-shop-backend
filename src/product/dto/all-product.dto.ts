import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';

export enum EnumProductSort {
  HIGN_PRICE = 'high-price',
  LOW_PRICE = 'low-price',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class AllProductDto extends PaginationDto {
  @IsOptional()
  @IsString()
  sort?: EnumProductSort;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
