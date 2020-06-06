import { Resolver, Mutation, Arg } from 'type-graphql';
import Quiz, { QuizSchema } from '../models/Quiz';

@Resolver()
export class QuizResolver {
  @Mutation(() => QuizSchema)
  async createQuiz(@Arg('name') name: string): Promise<QuizSchema> {
    try {
      return await Quiz.create({ name });
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
