import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'node:fs/promises';
import { SupportedFileTypes } from '../interfaces/file-storage.interface';
import { LocalFileStorageService } from './local-file-storage.service';

// Mock fs module
jest.mock('node:fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('LocalFileStorageService', () => {
  let service: LocalFileStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalFileStorageService],
    }).compile();

    service = module.get<LocalFileStorageService>(LocalFileStorageService);

    // Reset mocks
    jest.clearAllMocks();

    mockFs.mkdir.mockImplementation();
    mockFs.writeFile.mockImplementation();
    mockFs.rm.mockImplementation();
  });

  describe('uploadFile', () => {
    const mockFile = {
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('test content'),
    } as Express.Multer.File;

    it('should upload file successfully', async () => {
      const validateFileSpy = jest
        .spyOn(service, 'validateFile')
        .mockResolvedValue(true);

      const result = await service.uploadFile(mockFile, 'test-destination');

      expect(validateFileSpy).toHaveBeenCalledWith(mockFile);
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringMatching(/\.pdf$/),
        expect.any(Buffer),
      );
      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('test-destination'),
        { recursive: true },
      );
      expect(result).toMatchObject({
        originalName: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
      });
      expect(result.filename).toMatch(/\.pdf$/);
      expect(result.url).toContain('uploads/test-destination/');
    });

    it('should upload file to default directory when no destination provided', async () => {
      jest.spyOn(service, 'validateFile').mockResolvedValue(true);

      const result = await service.uploadFile(mockFile);

      expect(result.url).toContain('uploads/');
      expect(result.url).not.toContain('uploads/test-destination/');
    });

    it('should create destination directory if it does not exist', async () => {
      jest.spyOn(service, 'validateFile').mockResolvedValue(true);

      await service.uploadFile(mockFile, 'new-destination');

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('new-destination'),
        { recursive: true },
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete file if it exists', async () => {
      await service.deleteFile('test-file.pdf', 'test-destination');

      expect(mockFs.rm).toHaveBeenCalledWith(
        expect.stringContaining('test-file.pdf'),
        { force: true },
      );
    });

    it('should not throw error if file does not exist', async () => {
      await expect(
        service.deleteFile('non-existent.pdf'),
      ).resolves.not.toThrow();
      expect(mockFs.rm).toHaveBeenCalledWith(
        expect.stringContaining('non-existent.pdf'),
        { force: true },
      );
    });
  });

  describe('getFileUrl', () => {
    it('should return correct URL with destination', () => {
      const url = service.getFileUrl('test.pdf', 'documents');

      expect(url).toBe('http://localhost:3000/uploads/documents/test.pdf');
    });

    it('should return correct URL without destination', () => {
      const url = service.getFileUrl('test.pdf');

      expect(url).toBe('http://localhost:3000/uploads/test.pdf');
    });
  });

  describe('validateFile', () => {
    it('should validate supported file types', async () => {
      const validFile = {
        mimetype: SupportedFileTypes.PDF,
        size: 1024,
      } as Express.Multer.File;

      const result = await service.validateFile(validFile);

      expect(result).toBe(true);
    });

    it('should throw BadRequestException for unsupported file types', async () => {
      const invalidFile = {
        mimetype: 'application/unknown',
        size: 1024,
      } as Express.Multer.File;

      await expect(service.validateFile(invalidFile)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for files exceeding size limit', async () => {
      const largeFile = {
        mimetype: SupportedFileTypes.PDF,
        size: 20 * 1024 * 1024, // 20MB
      } as Express.Multer.File;

      await expect(service.validateFile(largeFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
