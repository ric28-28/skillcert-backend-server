import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizResultDto } from './dto/quiz-result.dto';
import { Quiz } from './entities/quiz.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Quiz> {
    return this.quizService.findOne(id);
  }

  @Get('lesson/:lessonId')
  findByLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
  ): Promise<Quiz[]> {
    return this.quizService.findByLesson(lessonId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.quizService.remove(id);
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  submitQuiz(@Body() submitQuizDto: SubmitQuizDto): Promise<QuizResultDto> {
    return this.quizService.submitQuiz(submitQuizDto);
  }

  @Get('attempt/:userId/:quizId')
  getUserQuizAttempt(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('quizId', ParseUUIDPipe) quizId: string,
  ): Promise<QuizAttempt | null> {
    return this.quizService.getUserQuizAttempt(userId, quizId);
  }

  @Get('passed/:userId/:quizId')
  hasUserPassedQuiz(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('quizId', ParseUUIDPipe) quizId: string,
  ): Promise<{ passed: boolean }> {
    return this.quizService
      .hasUserPassedQuiz(userId, quizId)
      .then((passed) => ({ passed }));
  }
}
