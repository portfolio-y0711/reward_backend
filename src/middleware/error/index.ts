import { ValidationError, ContextError } from '@app/typings'
import { Request, Response, NextFunction } from 'express'

function ApiErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  switch(true) {
    case err instanceof ValidationError:
      return res.status(err.code).json(err.message)
    case err instanceof ContextError:
      return res.status((err as ContextError).code).json(err.message)
  }
  return res.status(500).json('something went wrong')
}

export default ApiErrorHandler
