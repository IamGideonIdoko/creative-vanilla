import type { ErrorRequestHandler, Request, Response } from 'express';
/**
 * This function returns an error handling express
 * middleware. That can be configured according to need
 * @returns an error handler middleware function
 */
export const reqError = (): ErrorRequestHandler => {
  return (error: any, req: Request, res: Response) => {
    console.error(error);
    const message: string = error.message || 'Internal server error, please try again';
    const errorCode = error.errCode;
    return res.render('pages/error', { errorMessage: message, errorCode });
  };
};
