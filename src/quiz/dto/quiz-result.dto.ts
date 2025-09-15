export class QuestionResultDto {
  question_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points_earned: number;
}

export class QuizResultDto {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  completed_at: Date;
  question_results: QuestionResultDto[];
}
