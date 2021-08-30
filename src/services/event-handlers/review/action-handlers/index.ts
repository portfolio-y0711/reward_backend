import { IEventDatabase } from '@app/data'
import { IEventHandlers } from '../..'
import { BlarBlarEventHandler } from './blar_blar/handler.blar_blar-event'
import { ReviewEventActionRouter } from './handler.review-event'

export const EventHandlers = (context: { db: IEventDatabase }): IEventHandlers => {
  const { db } = context
  return {
    "REVIEW": ReviewEventActionRouter(db),
    "BLAR_BLAR": BlarBlarEventHandler(db)
  }
}