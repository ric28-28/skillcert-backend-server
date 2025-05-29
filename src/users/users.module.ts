import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersRepository } from "./users.repository"
import { UsersController } from "./controllers/users.controller"
import { UsersService } from "./providers/users.service"
import { User } from "./entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
