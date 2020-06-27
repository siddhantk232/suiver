import { modelOptions, prop, getModelForClass } from '@typegoose/typegoose';

import { registerEnumType, ObjectType, Field, ID } from 'type-graphql';

export enum QuestionType {
  MULTIPLECHOICE = 'MULTIPLECHOICE',
  PLAIN = 'PLAIN',
  ONEWORD = 'ONEWORD',
  TRUEFALSE = 'TRUEFALSE'
}

registerEnumType(QuestionType, {
  name: 'QuestionType',
  description: 'Available question types'
});

@ObjectType()
export class IOption {
  @Field()
  title: string;
  @Field(() => Boolean, { nullable: true })
  isCorrect?: Boolean;
}

@modelOptions({ schemaOptions: { collection: 'questions', timestamps: true } })
@ObjectType()
export class QuestionSchema {
  @Field(() => ID)
  id: string;

  @Field()
  @prop()
  quizId: string;

  @Field()
  @prop()
  question: string;

  @prop()
  @Field(() => QuestionType)
  type: QuestionType;

  @prop()
  @Field(() => [IOption], { nullable: true })
  options?: Array<IOption>;

  @Field(() => String, { nullable: true })
  answer?: String;
}

const Question = getModelForClass(QuestionSchema);

export default Question;
