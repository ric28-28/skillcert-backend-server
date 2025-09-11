import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonResource } from '../entities/lesson-resource.entity';
import { StorageModule } from '../storage/storage.module';
import { LessonResourcesController } from './lesson-resources.controller';
import { LessonResourcesService } from './lesson-resources.service';

@Module({
  imports: [TypeOrmModule.forFeature([LessonResource]), StorageModule],
  controllers: [LessonResourcesController],
  providers: [LessonResourcesService],
  exports: [LessonResourcesService],
})
export class LessonResourcesModule {}
