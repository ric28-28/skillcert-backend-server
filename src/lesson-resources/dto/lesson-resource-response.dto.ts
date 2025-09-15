// dto/lesson-resource-response.dto.ts
import { ResourceType } from '../../entities/lesson-resource.entity';

export class LessonResourceResponseDto {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  filePath: string;
  fileUrl: string;
  resourceType: ResourceType;
  lessonId: string;
  downloadCount: number;
  isActive: boolean;
  createdAt: Date;
}
