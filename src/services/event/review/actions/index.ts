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

export interface IReviewEventActionHandler {
  (eventInfo: IReviewPointEvent): Promise<void>
}
export type IReviewEventActionHandlers = {
  [Key in REVIEW_ACTION]: IReviewEventActionHandler
}

export const ComposeActionHandlerRoutes = (
  createActionHandlers: (db: IEventDatabase) => IReviewEventActionHandlers,
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


export const ReviewEventActionRouter = ComposeActionHandlerRoutes(reviewEventActionRoutes)
