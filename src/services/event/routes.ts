import { IEventDatabase } from '@app/data'
import { IEventRoutes } from '.'
import { ReviewEventActionRouter } from './review/actions'
import { BlarBlarEventActionRouter } from './review/actions/blar_blar'

export const EventHandlerRoutes = (context: { db: IEventDatabase }): IEventRoutes => {
  const { db } = context
  return {
    REVIEW: ReviewEventActionRouter(db).route,
    BLAR_BLAR: BlarBlarEventActionRouter(db).route,
  }
}
