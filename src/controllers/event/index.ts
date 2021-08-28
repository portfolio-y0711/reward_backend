import { NextFunction, Request, Response } from 'express'
import { AsyncRequestHandler } from '../async'
import { IUserService } from '../../services/users'
import { PostEvent } from './impl/controller.post-event'

export interface IEventController {
  postEvent: (req: Request, res: Response, next: NextFunction) => void
}

export default (service: IUserService): IEventController => {
  const postEvent = AsyncRequestHandler(PostEvent(service))
  return {
    postEvent
  }
}
