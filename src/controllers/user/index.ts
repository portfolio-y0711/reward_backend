// import { NextFunction, Request, Response } from 'express'
// import { AsyncRequestHandler } from '../async'
// import createService from '../../services/event-handlers'
// import { Test } from './impl'
// import { IEventHandlingService } from '../../services/event-handlers/index'
// import { GetUsers } from './impl/controller.get-users'
// import { IUserService } from '@app/services/users';

// export interface IUserController {
//   getUsers: (req: Request, res: Response, next: NextFunction) => void
// }

// export default (service: IUserService): IUserController => {
//   // const test = AsyncRequestHandler(Test(createService()))
//   const getUsers = AsyncRequestHandler(GetUsers(service))
//   return {
//     getUsers,
//   }
// }
