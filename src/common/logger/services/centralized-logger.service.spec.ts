import { Test, TestingModule } from '@nestjs/testing';
import { CentralizedLoggerService } from './centralized-logger.service';

describe('CentralizedLoggerService', () => {
  let service: CentralizedLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CentralizedLoggerService],
    }).compile();

    service = module.get<CentralizedLoggerService>(CentralizedLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set and get context', () => {
    const context = 'TestService';
    service.setContext(context);
    expect(service.getContext()).toBe(context);
  });

  it('should create a child logger with different context', () => {
    const parentContext = 'ParentService';
    const childContext = 'ChildService';
    
    service.setContext(parentContext);
    const childLogger = service.createChildLogger(childContext);
    
    expect(service.getContext()).toBe(parentContext);
    expect(childLogger.getContext()).toBe(childContext);
  });

  describe('logging methods', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      // Mock the underlying Logger methods to avoid actual console output during tests
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log debug messages', () => {
      const message = 'Debug message';
      const context = { userId: 'test123' };
      
      service.debug(message, context);
      
      // Since debug calls super.debug internally, we can't easily test the exact output
      // but we can verify the method runs without error
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log info messages', () => {
      const message = 'Info message';
      const context = { operation: 'test' };
      
      service.info(message, context);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      const message = 'Warning message';
      const context = { threshold: 90 };
      
      service.warn(message, context);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log error messages with error object', () => {
      const message = 'Error message';
      const error = new Error('Test error');
      const context = { operation: 'test_operation' };
      
      service.error(message, error, context);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('specialized logging methods', () => {
    let infoSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;

    beforeEach(() => {
      infoSpy = jest.spyOn(service, 'info').mockImplementation();
      errorSpy = jest.spyOn(service, 'error').mockImplementation();
    });

    afterEach(() => {
      infoSpy.mockRestore();
      errorSpy.mockRestore();
    });

    it('should log HTTP request', () => {
      const method = 'GET';
      const url = '/api/test';
      const context = { userId: 'user123' };
      
      service.logHttpRequest(method, url, context);
      
      expect(infoSpy).toHaveBeenCalledWith(
        `${method} ${url} - Request started`,
        expect.objectContaining({
          method,
          url,
          ...context,
        })
      );
    });

    it('should log successful HTTP response', () => {
      const method = 'GET';
      const url = '/api/test';
      const statusCode = 200;
      const responseTime = 150;
      const context = { userId: 'user123' };
      
      service.logHttpResponse(method, url, statusCode, responseTime, context);
      
      expect(infoSpy).toHaveBeenCalledWith(
        `${method} ${url} - Request completed`,
        expect.objectContaining({
          method,
          url,
          statusCode,
          responseTime,
          ...context,
        })
      );
    });

    it('should log error HTTP response as error', () => {
      const method = 'POST';
      const url = '/api/test';
      const statusCode = 500;
      const responseTime = 250;
      const context = { userId: 'user123' };
      
      service.logHttpResponse(method, url, statusCode, responseTime, context);
      
      expect(errorSpy).toHaveBeenCalledWith(
        `${method} ${url} - Request completed`,
        undefined,
        expect.objectContaining({
          method,
          url,
          statusCode,
          responseTime,
          ...context,
        })
      );
    });

    it('should log business event', () => {
      const event = 'user_registered';
      const details = { userId: 'user123', email: 'test@example.com' };
      const context = { source: 'registration_controller' };
      
      service.logBusinessEvent(event, details, context);
      
      expect(infoSpy).toHaveBeenCalledWith(
        `Business Event: ${event}`,
        expect.objectContaining({
          event,
          details,
          ...context,
        })
      );
    });

    it('should log database operation', () => {
      const operation = 'SELECT';
      const entity = 'users';
      const context = { userId: 'user123' };
      
      service.logDatabaseOperation(operation, entity, context);
      
      // Database operations use debug level
      const debugSpy = jest.spyOn(service, 'debug').mockImplementation();
      service.logDatabaseOperation(operation, entity, context);
      
      expect(debugSpy).toHaveBeenCalledWith(
        `Database ${operation} on ${entity}`,
        expect.objectContaining({
          operation,
          entity,
          ...context,
        })
      );
      
      debugSpy.mockRestore();
    });

    it('should log validation error', () => {
      const field = 'email';
      const value = 'invalid-email';
      const rule = 'must be valid email format';
      const context = { userId: 'user123' };
      
      const warnSpy = jest.spyOn(service, 'warn').mockImplementation();
      service.logValidationError(field, value, rule, context);
      
      expect(warnSpy).toHaveBeenCalledWith(
        `Validation failed for field '${field}' with value '${value}' - Rule: ${rule}`,
        expect.objectContaining({
          field,
          value,
          rule,
          ...context,
        })
      );
      
      warnSpy.mockRestore();
    });
  });
});