import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType()
export class CreateQuizOutput {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  clicks?: number;

  @Field(() => Int)
  attempt?: number;
}
