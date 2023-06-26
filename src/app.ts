import { Express, Request, Response, NextFunction } from 'express';
import express from 'express';

import apiRouter from './routes/api';
import { handleCustomErrors, handle500s } from './controllers/errors';
import { login } from './auth';

const app: Express = express();

app.use(express.json());
app.post("/login", login)
app.use('/api', apiRouter);

app.all('/*', (req: Request, res: Response, next: NextFunction) => {
  next({ status: 404, msg: 'Route not found' });
});

app.use(handleCustomErrors);
app.use(handle500s);

export default app;

