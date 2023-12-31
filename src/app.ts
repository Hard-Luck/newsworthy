import { Express, Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';

import apiRouter from './routes/api';
import {
  handleCustomErrors,
  handle500s,
  handlePSQLErrors
} from './controllers/errors';

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use('/api', apiRouter);

app.all('/*', (req: Request, res: Response, next: NextFunction) => {
  next({ status: 404, msg: 'Route not found' });
});

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500s);

export default app;
