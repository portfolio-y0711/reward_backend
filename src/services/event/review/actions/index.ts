import { IEventDatabase } from '@app/data'
import { IEvent } from '@app/typings'
import { reviewEventActionRoutes } from './routes'

export type REVIEW_ACTION = 'ADD' | 'MOD' | 'DELETE'

export interface IReviewPointEvent extends IEvent {
  action: REVIEW_ACTION
  reviewId: string
  content: string
  attachedPhotoIds: string[]
  userId: string
  placeId: string
}

export interface IReviewEventActionRoute {
  (eventInfo: IReviewPointEvent): Promise<void>
}
export type IReviewEventActionRoutes = {
  [Key in REVIEW_ACTION]: IReviewEventActionRoute
}

export const ComposeActionRoutes = (
  createActionHandlers: (db: IEventDatabase) => IReviewEventActionRoutes,
) => {
  return (db: IEventDatabase) => {
    const actionHandlers = createActionHandlers(db)
    const route = async (eventInfo: IReviewPointEvent) => {
      await actionHandlers[eventInfo.action](eventInfo)
    }
    return {
      route,
    }
  }
}

export const ReviewEventActionRouter = ComposeActionRoutes(reviewEventActionRoutes)
