import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { Question } from '../question/entities/question.entity';
import { Answer } from '../answer/entities/answer.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizValidationService } from './services/quiz-validation.service';
import { QuizResponseDto } from './dto/quiz-response.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    private quizValidationService: QuizValidationService,
  ) {}

  private toResponseDto(quiz: Quiz): QuizResponseDto {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      lesson_id: quiz.lesson_id,
      questions: quiz.questions?.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        answers: q.answers?.map((a) => ({
          id: a.id,
          text: a.text,
          correct: a.correct,
          created_at: a.created_at,
          updated_at: a.updated_at,
        })) || [],
        created_at: q.created_at,
        updated_at: q.updated_at,
      })) || [],
      created_at: quiz.created_at,
      updated_at: quiz.updated_at,
    };
  }

  async create(createQuizDto: CreateQuizDto): Promise<QuizResponseDto> {
    // Validate the quiz structure
    this.quizValidationService.validateQuiz(createQuizDto);

    // Create quiz
    const quiz = this.quizRepository.create({
      title: createQuizDto.title,
      description: createQuizDto.description,
      lesson_id: createQuizDto.lesson_id,
    });

    const savedQuiz = await this.quizRepository.save(quiz);

    // Create questions and answers
    for (const questionDto of createQuizDto.questions) {
      const question = this.questionRepository.create({
        quiz_id: savedQuiz.id,
        text: questionDto.text,
        type: questionDto.type,
      });

      const savedQuestion = await this.questionRepository.save(question);

      // Create answers for this question
      for (const answerDto of questionDto.answers) {
        const answer = this.answerRepository.create({
          question_id: savedQuestion.id,
          text: answerDto.text,
          correct: answerDto.correct,
        });

        await this.answerRepository.save(answer);
      }
    }

    // Return the complete quiz with relations
    return this.findOne(savedQuiz.id);
  }

  async findAll(): Promise<QuizResponseDto[]> {
    return await this.quizRepository.find({
      relations: ['lesson', 'questions', 'questions.answers'],
      order: {
        created_at: 'DESC',
        questions: {
          created_at: 'DESC',
        },
      },
    });
  }

  async findOne(id: string): Promise<QuizResponseDto> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ['lesson', 'questions', 'questions.answers'],
      order: {
        questions: {
          created_at: 'DESC',
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async findByLesson(lessonId: string): Promise<QuizResponseDto[]> {
    return await this.quizRepository.find({
      where: { lesson_id: lessonId },
      relations: ['questions', 'questions.answers'],
      order: {
        created_at: 'DESC',
        questions: {
          created_at: 'DESC',
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    const quiz = await this.findOne(id);

    // Delete answers first
    for (const question of quiz.questions) {
      await this.answerRepository.delete({ question_id: question.id });
    }

    // Delete questions
    await this.questionRepository.delete({ quiz_id: id });

    // Delete quiz
    await this.quizRepository.delete(id);
  }
}
