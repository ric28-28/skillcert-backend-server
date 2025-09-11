import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../logger.module';
import { CentralizedLoggerService } from '../services/centralized-logger.service';

describe('LoggerModule', () => {
  let module: TestingModule;
  let loggerService: CentralizedLoggerService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [LoggerModule],
    }).compile();

    loggerService = module.get<CentralizedLoggerService>(CentralizedLoggerService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CentralizedLoggerService', () => {
    expect(loggerService).toBeDefined();
    expect(loggerService).toBeInstanceOf(CentralizedLoggerService);
  });

  it('should export CentralizedLoggerService', () => {
    // Test that the service can be injected in other modules
    expect(loggerService.getContext()).toBe('Application');
    expect(typeof loggerService.info).toBe('function');
    expect(typeof loggerService.error).toBe('function');
    expect(typeof loggerService.warn).toBe('function');
    expect(typeof loggerService.debug).toBe('function');
  });

  it('should be a global module', () => {
    // LoggerModule should be decorated with @Global()
    // This allows it to be available across the entire application
    const moduleMetadata = Reflect.getMetadata('global', LoggerModule);
    expect(moduleMetadata).toBe(true);
  });
});