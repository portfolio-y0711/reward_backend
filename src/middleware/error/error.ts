import { ApiError, CustomError } from '@app/typings'
import { Request, Response, NextFunction } from 'express'

// function errorHandler(
//   err: TypeError | CustomError,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   let customError = err

//   if (!(err instanceof CustomError)) {
//     customError = new CustomError('Oh no, this is embarrasing. We are having troubles my friend')
//   }
//   res.status((customError as CustomError).status).send(customError)
// }

// export default errorHandler

function apiErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // in prod, don't use console.error or console.log
  // because it is not async
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.code).json(err.message);
  }

  return res.status(500).json('something went wrong');
}

export default apiErrorHandler
