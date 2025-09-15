# 403 Forbidden Page Implementation

This implementation provides comprehensive 403 Forbidden handling for the SkillCert backend API, including custom error responses, route protection, and role-based access control.

## 🚀 Features

- **Custom 403 Error Responses** - Consistent JSON error format
- **Route Protection** - Authentication and authorization guards
- **Role-Based Access Control** - Admin, Moderator, and User roles
- **Global Exception Handling** - Centralized error management
- **Protected Routes** - Admin and moderator-only endpoints
- **Public Routes** - Unprotected endpoints for general access

## 📁 File Structure

```
src/
├── common/
│   ├── decorators/
│   │   └── roles.decorator.ts          # @Roles() decorator
│   ├── filters/
│   │   ├── all-exceptions.filter.ts    # Global exception handler
│   │   └── forbidden-exception.filter.ts # 403-specific handler
│   ├── guards/
│   │   ├── auth.guard.ts               # Authentication guard
│   │   └── roles.guard.ts              # Role-based authorization
│   └── index.ts                        # Common exports
├── admin/
│   ├── admin.controller.ts             # Protected admin endpoints
│   └── admin.module.ts                 # Admin module
├── public/
│   ├── public.controller.ts            # Public endpoints
│   └── public.module.ts                # Public module
└── main.ts                             # Global configuration
```

## 🔧 Implementation Details

### 1. Exception Filters

**AllExceptionsFilter** - Global exception handler that:
- Catches all HTTP exceptions
- Provides consistent error response format
- Logs errors for debugging
- Includes stack traces in development mode

**ForbiddenExceptionFilter** - Specific 403 handler that:
- Catches ForbiddenException instances
- Returns detailed 403 error responses
- Includes request context information

### 2. Guards

**AuthGuard** - Authentication guard that:
- Validates Authorization header
- Checks for Bearer token format
- Simulates user authentication (replace with JWT validation)
- Sets user context in request

**RolesGuard** - Authorization guard that:
- Checks user roles against required roles
- Uses @Roles() decorator metadata
- Throws ForbiddenException for insufficient permissions

### 3. Decorators

**@Roles()** - Role requirement decorator:
```typescript
@Roles(UserRole.ADMIN)           // Admin only
@Roles(UserRole.ADMIN, UserRole.MODERATOR) // Admin or Moderator
```

## 🛡️ Protected Routes

### Admin Controller (`/admin/*`)

All admin routes require authentication and specific roles:

- `GET /admin/dashboard` - Admin only
- `GET /admin/users` - Admin or Moderator
- `POST /admin/system/maintenance` - Admin only
- `DELETE /admin/users/:id` - Admin only
- `GET /admin/analytics` - Admin or Moderator

### Usage Example

```typescript
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  
  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  getDashboard() {
    // Admin-only endpoint
  }
}
```

## 🌐 Public Routes

### Public Controller (`/public/*`)

All public routes are accessible without authentication:

- `GET /public/info` - Application information
- `GET /public/courses` - Public course catalog
- `GET /public/categories` - Public course categories

## 📝 Error Response Format

### 403 Forbidden Response

```json
{
  "statusCode": 403,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/admin/dashboard",
  "method": "GET",
  "message": "Access Denied - Insufficient permissions",
  "error": "Forbidden",
  "details": "Access denied. Required roles: admin. User role: user"
}
```

### 401 Unauthorized Response

```json
{
  "statusCode": 401,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/admin/dashboard",
  "method": "GET",
  "message": "Authorization header is required",
  "error": "Unauthorized"
}
```

## 🔐 Authentication

### Current Implementation

The current implementation uses a simple header-based authentication:

```bash
# Valid request
curl -H "Authorization: Bearer valid-token-here" http://localhost:3000/admin/dashboard

# Invalid request (403 Forbidden)
curl -H "Authorization: Bearer invalid-token" http://localhost:3000/admin/dashboard

# Missing auth (401 Unauthorized)
curl http://localhost:3000/admin/dashboard
```

### Production Integration

To integrate with real authentication:

1. **Replace AuthGuard** with JWT validation
2. **Extract user from JWT token** instead of simulating
3. **Add token refresh** mechanism
4. **Implement proper user session** management

## 🧪 Testing

### Test Protected Routes

```bash
# Test admin dashboard (requires admin role)
curl -H "Authorization: Bearer admin-token" http://localhost:3000/admin/dashboard

# Test user management (requires admin/moderator role)
curl -H "Authorization: Bearer moderator-token" http://localhost:3000/admin/users

# Test public routes (no auth required)
curl http://localhost:3000/public/info
```

### Expected Responses

- **200 OK** - Successful access with proper role
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Valid authentication but insufficient role

## 🚀 Usage in Other Controllers

To protect any controller or endpoint:

```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('protected')
@UseGuards(AuthGuard, RolesGuard)
export class ProtectedController {
  
  @Get('admin-only')
  @Roles(UserRole.ADMIN)
  adminOnly() {
    return { message: 'Admin access granted' };
  }
  
  @Get('moderator-or-admin')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  moderatorOrAdmin() {
    return { message: 'Moderator/Admin access granted' };
  }
}
```

## 🔄 Redirect Behavior

Since this is a backend API, "redirects" are handled through:

1. **HTTP Status Codes** - 401/403 responses
2. **Error Messages** - Clear indication of access denied
3. **Frontend Integration** - Frontend should handle redirects based on status codes

## 📋 Next Steps

1. **Integrate with JWT** - Replace simulated authentication
2. **Add User Context** - Extract real user from tokens
3. **Implement Refresh Tokens** - Handle token expiration
4. **Add Rate Limiting** - Protect against abuse
5. **Enhance Logging** - Track access attempts and failures

This implementation provides a solid foundation for 403 Forbidden handling in the SkillCert backend API.
