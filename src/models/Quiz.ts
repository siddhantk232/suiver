/* eslint-disable no-unused-vars */
import {
  modelOptions,
  prop,
  Ref,
  getModelForClass
} from '@typegoose/typegoose';

import User, { UserSchema } from './User';

export enum QuestionType {
  MULTIPLECHOICE = 'MULTIPLECHOICE',
  PLAIN = 'PLAIN',
  ONEWORD = 'ONEWORD',
  TRUEFALSE = 'TRUEFALSE'
}

export interface IOption {
  title: string;
  isCorrect?: Boolean;
}

export interface IQuestion {
  question: string;
  type: QuestionType;
  options?: IOption[];
  answer?: String;
}

@modelOptions({ schemaOptions: { collection: 'quizzes', timestamps: true } })
class QuizSchema {
  @prop()
  name: string;

  @prop()
  questions: IQuestion;

  @prop({ ref: User }) // 1:1
  public createdBy: Ref<UserSchema>;

  @prop()
  clicks?: number;

  @prop()
  attempt?: number;
}

const Quiz = getModelForClass(QuizSchema);

export default Quiz;
