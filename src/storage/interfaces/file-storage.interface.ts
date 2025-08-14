export interface FileUploadResult {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export interface FileStorageInterface {
  uploadFile(
    file: Express.Multer.File,
    destination?: string,
  ): Promise<FileUploadResult>;
  deleteFile(filename: string, destination?: string): Promise<void>;
  getFileUrl(filename: string, destination?: string): string;
  validateFile(file: Express.Multer.File): Promise<boolean>;
}

export enum SupportedFileTypes {
  // Images
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  GIF = 'image/gif',
  WEBP = 'image/webp',

  // Documents
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  TXT = 'text/plain',

  // Videos
  MP4 = 'video/mp4',
  AVI = 'video/avi',
  MOV = 'video/quicktime',
  WMV = 'video/x-ms-wmv',

  // Audio
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',

  // Archives
  ZIP = 'application/zip',
  RAR = 'application/x-rar-compressed',
}
