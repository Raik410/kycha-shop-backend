import { ArrayMinSize, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[];

  @IsNumber()
  categoryId: number;
}
