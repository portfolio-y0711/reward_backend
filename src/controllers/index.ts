import { NextFunction, Request, Response } from 'express'
import { AsyncRequestHandler } from './async'
import createService from '../services'
import { Test } from './impl'
import { IEventHandlingService } from '../services/index'

export interface IUserController {
  test: (req: Request, res: Response, next: NextFunction) => void
}

export default (service: IEventHandlingService): IUserController => {
  const test = AsyncRequestHandler(Test(createService()))
  return {
    test  
  }
}
