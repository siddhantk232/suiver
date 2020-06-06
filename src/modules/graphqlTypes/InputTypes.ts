import { InputType, Field } from 'type-graphql';
import { QuestionType } from '../../models/Question';

@InputType()
export class OptionInput {
  @Field()
  title: string;
  @Field(() => Boolean, { nullable: true })
  isCorrect?: Boolean;
}

@InputType()
export class QuestionInput {
  @Field()
  question: string;
  @Field(() => QuestionType)
  type: QuestionType;
  @Field(() => OptionInput, { nullable: true })
  options?: OptionInput[];
  @Field(() => String, { nullable: true })
  answer?: String;
}
