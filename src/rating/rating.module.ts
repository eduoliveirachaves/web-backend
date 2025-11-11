import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
