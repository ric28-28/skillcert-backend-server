import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // For demonstration purposes, we'll check for a simple header
    // In a real implementation, you would validate JWT tokens here
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    // Simple token validation (in real app, validate JWT)
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    const token = authHeader.substring(7);
    if (!token || token.length < 10) {
      throw new UnauthorizedException('Invalid token');
    }

    // Simulate user extraction from token
    // In real implementation, decode JWT and set user in request
    request.user = {
      id: 'user-id-from-token',
      email: 'user@example.com',
      role: 'user', // This would come from the JWT payload
    };

    return true;
  }
}
