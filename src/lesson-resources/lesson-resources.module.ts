import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonResourcesService } from './lesson-resources.service';
import { LessonResourcesController } from './lesson-resources.controller';
import { LessonResource } from '../entities/lesson-resource.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([LessonResource]), StorageModule],
  controllers: [LessonResourcesController],
  providers: [LessonResourcesService],
  exports: [LessonResourcesService],
})
export class LessonResourcesModule {}
