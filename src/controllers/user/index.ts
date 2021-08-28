import { NextFunction, Request, Response } from 'express'
import { AsyncRequestHandler } from '../async'
import createUserService, { IUserService } from '../../services/users'
import createService from '../../services'
import { Test } from './impl'
import { IEventHandlingService } from '../../services/index'
import { GetUsers } from './impl/controller.get-users'

export interface IUserController {
  getUsers: (req: Request, res: Response, next: NextFunction) => void
}

export default (service: IUserService): IUserController => {
  // const test = AsyncRequestHandler(Test(createService()))
  const getUsers = AsyncRequestHandler(GetUsers(service))
  return {
    getUsers
  }
}
