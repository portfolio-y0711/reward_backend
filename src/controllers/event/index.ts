import { IEventHandlingService } from '@app/services/event'
import { NextFunction, Request, Response } from 'express'
import { AsyncRequestHandler } from '../async'
import { PostEvent } from './impl/controller.post-event'

export interface IEventController {
  postEvent: (req: Request, res: Response, next: NextFunction) => void
}

export default (services: IEventHandlingService): IEventController => {
  const postEvent = AsyncRequestHandler(PostEvent(services))
  return {
    postEvent,
  }
}
