import express, { Express, Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './src/graphql/schema';
import { resolvers } from './src/graphql/resolvers';
import logger from './src/lib/logger';
import { createContext } from './src/graphql/context';

dotenv.config();

const port = process.env.PORT || 3000;

const app: Express = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
// Note you must call `server.start()` on the `ApolloServer` instance before passing the instance to `expressMiddleware`
await server.start();
// Specify the path where we'd like to mount our server
app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, { context: createContext }),
);

const allowedOrigins = [process.env.CLIENT_URL];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/healthcheck', (req: Request, res: Response) => {
  res.send('Ok');
});
app.get('/', (req: Request, res: Response) => {
  res.send('RestApi Route');
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
