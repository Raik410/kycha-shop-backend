import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  @HttpCode(200)
  @Auth()
  async getAll() {
    return this.reviewService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @Get('average-value/:productId')
  @HttpCode(200)
  @Auth()
  async getAverageValueByProductId(@Param('productId') productId: number) {
    return this.reviewService.getAverageValueByProductId(productId);
  }

  @UsePipes(new ValidationPipe())
  @Post('leave/:productId')
  @HttpCode(200)
  @Auth()
  async leaveReview(
    @Param('productId') productId: string,
    @CurrentUser('id') userId: number,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.create(userId, dto, +productId);
  }
}
