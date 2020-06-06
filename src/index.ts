import 'reflect-metadata';
import 'dotenv/config';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import expressPlayground from 'graphql-playground-middleware-express';
import { buildSchema, Resolver, Query } from 'type-graphql';
import { connect } from 'mongoose';
import * as session from 'express-session';
import * as Redis from 'ioredis';
import * as connectRedis from 'connect-redis';

import authRoutes from './Routes/auth';
import { QuizResolver } from './modules/Quiz';

const redisClient = new Redis();
const redisStore = connectRedis(session);

const port = process.env.PORT || 9876;

@Resolver()
class Hello {
  @Query(() => String)
  hello(): string {
    return 'Hello world!';
  }
}

async function main() {
  try {
    const app = express();

    app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        name: 'sid',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true
        },
        store: new redisStore({
          client: redisClient
        })
      })
    );

    await connect(process.env.MONGO_URI as string, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    console.log('\x1b[32m%s\x1b[0m', '[ mongoDB ] connected ✔');

    const schema = await buildSchema({
      resolvers: [Hello, QuizResolver]
    });

    app.use('/auth', authRoutes);

    app.use(
      '/graphql',
      graphqlHTTP({
        schema
      })
    );

    app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

    app.listen(port);

    console.log(
      '\x1b[33m%s\x1b[0m',
      `[ server ] 🚀 Server started on port: ${port}`
    );
    console.log(
      '\x1b[36m%s\x1b[0m',
      '[ server ] 🔥 graphql endpoint: /graphql'
    );
  } catch (error) {
    console.log(error);
  }
}

main();
