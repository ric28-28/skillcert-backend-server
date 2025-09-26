import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UserRole } from './users/entities/user.entity';
import { Roles } from './common/decorators/roles.decorator';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Controller()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
