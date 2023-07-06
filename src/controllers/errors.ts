import { Request, Response, NextFunction } from 'express';

type CustomError = { status: number; msg: string };
interface PostgreSQLError {
  code: string;
  message: string;
}

function isPostgreSQLError(error: unknown): error is PostgreSQLError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

function isCustomError(err: unknown): err is CustomError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    'msg' in err &&
    Object.keys(err).length === 2
  );
}
export const handleCustomErrors = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (isCustomError(err)) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

export function handlePSQLErrors(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (isPostgreSQLError(err)) {
    const codes = ['22P02', '23502'];
    if (codes.includes(err.code)) {
      res.status(400).send({ msg: 'Bad request' });
    }
  } else {
    next(err);
  }
}

export const handle500s = (err: unknown, req: Request, res: Response): void => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
};
