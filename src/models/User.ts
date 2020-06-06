import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
@ObjectType()
export class UserSchema {
  @prop()
  @Field()
  public name: string;

  @Field(() => ID)
  id: string;

  @prop()
  @Field()
  public email: string;

  @prop()
  @Field()
  public imageUrl: string;

  @prop()
  public googleId?: string;

  @prop()
  public githubId?: number;
}

const User = getModelForClass(UserSchema);

export default User;
