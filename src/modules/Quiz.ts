import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import Question, { QuestionSchema, QuestionType } from '../models/Question';
import Quiz, { QuizSchema } from '../models/Quiz';
import { OptionInput } from './graphqlTypes/InputTypes';

@Resolver(() => QuizSchema)
export class QuizResolver {
  @Query(() => QuizSchema)
  async getQuiz(@Arg('id') id: String) {
    try {
      return Quiz.findById(id).populate('createdBy');
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Query(() => [QuestionSchema])
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

  @Mutation(() => QuizSchema)
  async createQuiz(
    @Arg('name') name: string,
    @Arg('createdBy') createdBy: String
  ): Promise<QuizSchema> {
    try {
      return await Quiz.create({ name, createdBy: createdBy as any });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  @Mutation(() => QuestionSchema)
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
  async deleteQuiz(@Arg('id') id: string) {
    const ok = await Quiz.deleteOne({ _id: id });
    return !!ok.deletedCount;
  }

  @Mutation(() => Boolean)
  async deleteQuestion(@Arg('id') id: string) {
    const ok = await Question.deleteOne({ _id: id });
    return !!ok.deletedCount;
  }
}
