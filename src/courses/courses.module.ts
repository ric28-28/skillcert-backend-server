/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CoursesRepository } from "./courses.repository"
import { CoursesController } from "./controllers/courses.controller"
import { CoursesService } from "./providers/courses.service"
import { Course } from "./entities/course.entity"
import { UsersModule } from "../users/users.module"

@Module({
    imports: [
        TypeOrmModule.forFeature([Course]),
        UsersModule, // Import to use UsersService for validation
    ],
    controllers: [CoursesController],
    providers: [CoursesService, CoursesRepository],
    exports: [CoursesService, CoursesRepository],
})
export class CoursesModule { }