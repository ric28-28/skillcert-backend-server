// dto/course-progress-response.dto.ts
import { ProgressStatus } from '../entities/course-progress.entity';

export class CourseProgressResponseDto {
  enrollmentId: string;
  lessonId: string;
  status: ProgressStatus;
  lessonTitle?: string; // if you want to expose related info
}

export class CompletionRateResponseDto {
  enrollmentId: string;
  completed: number;
  total: number;
  completionRate: number;
}

export class AnalyticsResponseDto {
  totalProgress: number;
  completed: number;
  overallCompletionRate: number;
}
