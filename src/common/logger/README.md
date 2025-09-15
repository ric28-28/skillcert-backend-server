# Centralized Logger Service

This document explains how to use the centralized logging system implemented in the skillcert-backend-server application.

## Overview

The `CentralizedLoggerService` extends NestJS's built-in Logger to provide enhanced logging capabilities with structured context and multiple log levels.

## Features

- **Multiple Log Levels**: debug, info, warn, error
- **Structured Context**: Add metadata to log entries for better traceability
- **Request Tracing**: Built-in support for HTTP request/response logging
- **Business Event Logging**: Specialized methods for business logic events
- **Error Handling**: Enhanced error logging with stack traces and context
- **Child Loggers**: Create context-specific logger instances

## Log Levels

- **DEBUG**: Detailed information for debugging and troubleshooting
- **INFO**: General informational messages about application flow
- **WARN**: Warning messages that don't stop operation but indicate potential issues
- **ERROR**: Error messages with optional stack traces and detailed context

## Basic Usage

### 1. Inject the Logger Service

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { CentralizedLoggerService } from '../common/logger';

@Injectable()
export class YourService {
  constructor(
    @Inject(CentralizedLoggerService)
    private readonly logger: CentralizedLoggerService,
  ) {
    this.logger.setContext(YourService.name);
  }
}
```

### 2. Basic Logging

```typescript
// Info logging
this.logger.info('User registration completed');

// Debug logging
this.logger.debug('Processing user data');

// Warning logging
this.logger.warn('High memory usage detected');

// Error logging
this.logger.error('Database connection failed', error);
```

### 3. Logging with Context

```typescript
this.logger.info('User login successful', {
  userId: 'user123',
  ip: '192.168.1.100',
  method: 'POST',
  url: '/auth/login',
  responseTime: 250,
});
```

## Advanced Features

### HTTP Request/Response Logging

```typescript
// Log request start
this.logger.logHttpRequest('POST', '/api/users', {
  userId: 'user123',
  requestId: 'req-456',
});

// Log request completion
this.logger.logHttpResponse('POST', '/api/users', 201, 180, {
  userId: 'user123',
  requestId: 'req-456',
});
```

### Business Event Logging

```typescript
this.logger.logBusinessEvent('order_completed', {
  orderId: 'order789',
  userId: 'user123',
  amount: 99.99,
  items: 3,
});
```

### Database Operation Logging

```typescript
this.logger.logDatabaseOperation('INSERT', 'users', {
  userId: 'user123',
  operation: 'create_user',
});
```

### Validation Error Logging

```typescript
this.logger.logValidationError(
  'email',
  'invalid-email@',
  'must be valid email format',
  {
    userId: 'user123',
    operation: 'user_registration',
  }
);
```

### Child Loggers

```typescript
const authLogger = this.logger.createChildLogger('AuthModule');
authLogger.info('Authentication module initialized');
```

## Context Interface

The `LogContext` interface provides structure for additional logging context:

```typescript
interface LogContext {
  userId?: string;
  requestId?: string;
  correlationId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  [key: string]: any; // Additional custom properties
}
```

## Configuration

The logger automatically formats messages with context information:

```
[INFO] 2024-01-15T10:30:45.123Z [YourService] User login successful [POST /auth/login | User: user123 | RequestID: req-456 | Status: 200 | 250ms | IP: 192.168.1.100]
```

## Integration with Exception Filters

The centralized logger is automatically used by the `AllExceptionsFilter` to log unhandled exceptions with full context:

```typescript
this.logger.error(
  'Unhandled exception: User not found',
  exception,
  {
    method: 'GET',
    url: '/api/users/123',
    statusCode: 404,
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    requestId: 'req-789',
  }
);
```

## Best Practices

1. **Set Context**: Always set the context when injecting the logger
2. **Use Appropriate Levels**: Choose the right log level for your message
3. **Include Relevant Context**: Add metadata that helps with debugging
4. **Log Business Events**: Track important business logic events
5. **Error Context**: Always include relevant context with error logs
6. **Request Tracing**: Use requestId for distributed tracing

## Environment Variables

The logger respects the following environment variables:

- `NODE_ENV`: When set to 'development', includes stack traces in error responses
- Standard NestJS logging environment variables apply

## Migration from Console Logging

Replace scattered `console.log`, `console.error`, etc., with structured logging:

```typescript
// Before
console.log('User created:', userId);
console.error('Error:', error.message);

// After
this.logger.info('User created successfully', { userId });
this.logger.error('User creation failed', error, { userId, operation: 'create_user' });
```

## Demo

Run the demonstration script to see the logger in action:

```typescript
import { demonstrateLogger } from './common/logger/demo';
demonstrateLogger();
```