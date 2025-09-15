import { Module } from '@nestjs/common';
import { LOCAL_FILE_STORAGE_SERVICE } from './constants';
import { LocalFileStorageService } from './services/local-file-storage.service';

@Module({
  providers: [
    {
      provide: LOCAL_FILE_STORAGE_SERVICE,
      useClass: LocalFileStorageService,
    },
  ],
  exports: [LOCAL_FILE_STORAGE_SERVICE],
})
export class StorageModule {}
