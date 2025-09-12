import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizResultDto } from './dto/quiz-result.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { Quiz } from './entities/quiz.entity';
import { QuizService } from './quiz.service';

@Controller('quizzes')
@ApiTags('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({
    status: 201,
    description: 'Quiz created successfully',
    type: Quiz,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Validation failed' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiResponse({
    status: 200,
    description: 'Quizzes retrieved successfully',
    type: [Quiz],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  findAll(): Promise<Quiz[]> {
    return this.quizService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID' })
  @ApiResponse({
    status: 200,
    description: 'Quiz retrieved successfully',
    type: Quiz,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid quiz ID',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Quiz not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
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
  @ApiOperation({ summary: 'Delete quiz by ID' })
  @ApiResponse({ status: 204, description: 'Quiz deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid quiz ID',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Quiz not found' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.quizService.remove(id);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit quiz answers' })
  @ApiResponse({
    status: 200,
    description: 'Quiz submitted successfully',
    type: QuizResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid submission data',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid quiz submission' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
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
