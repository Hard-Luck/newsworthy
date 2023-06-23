import { Request, Response, NextFunction } from 'express';

export const handleCustomErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg || 'Bad request' });
  } else {
    next(err);
  }
};

export const handle500s = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};
