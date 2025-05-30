import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReferencesModule } from './references/references.module';
import { Reference } from './entities/reference.entity';
import { Module as CourseModule } from './entities/module.entity';
import { Lesson } from './entities/lesson.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
