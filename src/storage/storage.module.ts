import { Module } from '@nestjs/common';
import { LocalFileStorageService } from './services/local-file-storage.service';
import { LOCAL_FILE_STORAGE_SERVICE } from './constants';

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
