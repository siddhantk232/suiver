import { Request } from 'express';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import User, { UserSchema } from '../models/User';
import { isAuth } from './middlewares/isAuth';

@Resolver()
export class AuthResolver {
  @Query(() => UserSchema)
  @UseMiddleware(isAuth)
  async me(@Ctx() context: Request) {
    try {
      if (context.session!.userId)
        return User.findById(context.session!.userId);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
