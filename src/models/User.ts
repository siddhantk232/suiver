import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
export class UserSchema {
  @prop()
  public name: string;

  @prop()
  public email: string;

  @prop()
  public imageUrl: string;

  @prop()
  public googleId?: string;

  @prop()
  public githubId?: number;
}

const User = getModelForClass(UserSchema);

export default User;
