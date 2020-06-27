import { MiddlewareFn } from 'type-graphql';
import { Request } from 'express';

export const isAuth: MiddlewareFn<Request> = async ({ context }, next) => {
  if (!context.session!.userId) {
    throw new Error('not authenticated');
  }

  return next();
};
