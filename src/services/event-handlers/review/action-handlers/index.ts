import { IEventDatabase } from '@app/data'
import { BlarBlarEventHandler } from '@app/services/event/review/actions/blar_blar/handler.blar_blar-event'
import { IEventHandlers } from '../..'
import { ReviewEventActionRouter } from './handler.review-event'

export const EventHandlers = (context: { db: IEventDatabase }): IEventHandlers => {
  const { db } = context
  return {
    REVIEW: ReviewEventActionRouter(db).route,
    BLAR_BLAR: BlarBlarEventHandler(db),
  }
}
