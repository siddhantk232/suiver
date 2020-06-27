import {
  Arg,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
  Ctx
} from 'type-graphql';
import Question, { QuestionSchema, QuestionType } from '../models/Question';
import Quiz, { QuizSchema } from '../models/Quiz';
import { OptionInput } from './graphqlTypes/InputTypes';
import { isAuth } from './middlewares/isAuth';
import { Request } from 'express';
import { CreateQuizOutput } from './graphqlTypes/ObjectTypes';

@Resolver(() => QuizSchema)
export class QuizResolver {
  @Query(() => QuizSchema)
  @UseMiddleware(isAuth)
  async getQuiz(@Arg('id') id: String) {
    try {
      return Quiz.findById(id).populate('createdBy');
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Query(() => [QuestionSchema])
  @UseMiddleware(isAuth)
  async getQuestions(@Arg('quizId') quizId: string) {
    try {
      const questions = await Question.find({ quizId });

      return questions.map((question) => {
        return {
          id: question.id,
          type: question.type,
          question: question.question,
          answer: question.answer,
          quizId: question.quizId,
          options: question.options?.reduce(
            (acc, val) => acc.concat(val as any),
            []
          )
        };
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation(() => CreateQuizOutput)
  @UseMiddleware(isAuth)
  async createQuiz(
    @Arg('name') name: string,
    @Ctx() context: Request
  ): Promise<QuizSchema> {
    try {
      return await Quiz.create({ name, createdBy: context.session!.userId });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation(() => QuestionSchema)
  @UseMiddleware(isAuth)
  async createQuestion(
    @Arg('question') question: string,
    @Arg('type', () => QuestionType) type: QuestionType,
    @Arg('quizId') quizId: string,
    @Arg('answer', { nullable: true }) answer: string,
    @Arg('options', () => OptionInput, { nullable: true })
    options: OptionInput[]
  ): Promise<QuestionSchema> {
    try {
      const createdQuestion = await Question.create({
        question,
        type,
        quizId,
        answer,
        options
      });

      return {
        id: createdQuestion.id,
        quizId: createdQuestion.id,
        question: createdQuestion.question,
        type: createdQuestion.type,
        options: createdQuestion?.options?.reduce(
          (acc, val) => acc.concat(val as any),
          []
        )
      };
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteQuiz(@Arg('id') id: string) {
    const ok = await Quiz.deleteOne({ _id: id });
    return !!ok.deletedCount;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteQuestion(@Arg('id') id: string) {
    const ok = await Question.deleteOne({ _id: id });
    return !!ok.deletedCount;
  }
}
