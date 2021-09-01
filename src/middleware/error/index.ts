import { ApiError, CustomError } from '@app/typings'
import { Request, Response, NextFunction } from 'express'

function apiErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.code).json(err.message)
  } else if (err instanceof CustomError) {
    return res.status((err as CustomError).code).json(err.message)
  }

  return res.status(500).json('something went wrong')
}

export default apiErrorHandler
