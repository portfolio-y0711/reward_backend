import { NextFunction, Request, Response } from 'express'
import { AsyncRequestHandler } from './async'
import { Test } from './impl'

export interface IUserController {
  test: (req: Request, res: Response, next: NextFunction) => void
}

export default (): IUserController => {
  const test = AsyncRequestHandler(Test())
  return {
    test  
  }
}
