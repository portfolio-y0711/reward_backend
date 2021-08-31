import { IEventDatabase } from '@app/data'
import { IEventHandlers } from '.'
import { BlarBlarEventHandler } from './review/actions/blar_blar/handler.blar_blar-event'
import { ReviewEventActionRouter } from './review/actions'

export const EventHandlerRoutes = (context: { db: IEventDatabase }): IEventHandlers => {
  const { db } = context
  return {
    REVIEW: ReviewEventActionRouter(db).route,
    BLAR_BLAR: BlarBlarEventHandler(db),
  }
}
