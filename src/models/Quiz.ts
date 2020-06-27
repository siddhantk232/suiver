import {
  getModelForClass,
  modelOptions,
  prop,
  Ref
} from '@typegoose/typegoose';
import { Field, ObjectType, ID, Int } from 'type-graphql';

import { UserSchema } from './User';

@modelOptions({ schemaOptions: { collection: 'quizzes', timestamps: true } })
@ObjectType()
export class QuizSchema {
  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  name: string;

  @prop({ ref: () => UserSchema }) // 1:1
  @Field(() => UserSchema, { nullable: true })
  public createdBy?: Ref<UserSchema>;

  @prop({ default: 0 })
  @Field(() => Int)
  clicks?: number;

  @prop({ default: 0 })
  @Field(() => Int)
  attempt?: number;
}

const Quiz = getModelForClass(QuizSchema);

export default Quiz;
