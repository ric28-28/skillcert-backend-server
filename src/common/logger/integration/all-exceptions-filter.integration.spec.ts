import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from '../../filters/all-exceptions.filter';
import { CentralizedLoggerService } from '../services/centralized-logger.service';
import { LoggerModule } from '../logger.module';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AllExceptionsFilter Integration', () => {
  let filter: AllExceptionsFilter;
  let loggerService: CentralizedLoggerService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [AllExceptionsFilter],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
    loggerService = module.get<CentralizedLoggerService>(CentralizedLoggerService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
    expect(loggerService).toBeDefined();
  });

  it('should use centralized logger for error logging', () => {
    // Spy on the logger error method
    const errorSpy = jest.spyOn(loggerService, 'error').mockImplementation();

    // Mock HTTP context
    const mockRequest = {
      method: 'GET',
      url: '/api/test',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('Mozilla/5.0'),
      headers: { 'x-request-id': 'test-request-id' },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };

    const testError = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    // Execute the filter
    filter.catch(testError, mockHost as any);

    // Verify logger was called with correct parameters
    expect(errorSpy).toHaveBeenCalledWith(
      'Unhandled exception: Test error',
      testError,
      expect.objectContaining({
        method: 'GET',
        url: '/api/test',
        statusCode: 400,
        ip: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        requestId: 'test-request-id',
      })
    );

    errorSpy.mockRestore();
  });
});