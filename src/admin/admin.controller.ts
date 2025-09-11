import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  getDashboard() {
    return {
      message: 'Welcome to Admin Dashboard',
      data: {
        totalUsers: 150,
        totalCourses: 25,
        totalEnrollments: 1200,
        systemStatus: 'Healthy',
      },
    };
  }

  @Get('users')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @HttpCode(HttpStatus.OK)
  getAllUsers() {
    return {
      message: 'User management - Admin/Moderator access required',
      data: {
        users: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'moderator',
          },
        ],
      },
    };
  }

  @Post('system/maintenance')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  startMaintenance() {
    return {
      message: 'System maintenance started - Admin access required',
      data: {
        status: 'Maintenance mode activated',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Delete('users/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  deleteUser() {
    return {
      message: 'User deletion - Admin access required',
      data: {
        status: 'User deleted successfully',
      },
    };
  }

  @Get('analytics')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @HttpCode(HttpStatus.OK)
  getAnalytics() {
    return {
      message: 'Analytics data - Admin/Moderator access required',
      data: {
        monthlyStats: {
          newUsers: 45,
          courseCompletions: 120,
          revenue: 15000,
        },
      },
    };
  }
}
