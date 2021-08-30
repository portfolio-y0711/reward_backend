import { IEventDatabase } from '@app/data'
import { IEvent } from '@app/typings'
import { AddReviewActionHandler } from './review/impl/action.handler.add'
import { DelReviewActionHandler } from './review/impl/action.handler.delete'
import { ModReviewActionHandler } from './review/impl/action.handler.mod'

export type REVIEW_ACTION = "ADD" | "MOD" | "DELETE"

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

export const ReviewEventActionRouter = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    const addReviewActionHandler = AddReviewActionHandler(db)
    const modReviewActionHandler = ModReviewActionHandler(db)
    const delReviewActionHandler = DelReviewActionHandler(db)
    const actionHandlerRoutingTable = {
      "ADD": (eventInfo: IReviewPointEvent) => addReviewActionHandler(eventInfo),
      "MOD": (eventInfo: IReviewPointEvent) => modReviewActionHandler(eventInfo),
      "DELETE": (eventInfo: IReviewPointEvent) => delReviewActionHandler(eventInfo),
    }
    await actionHandlerRoutingTable[eventInfo.action](eventInfo)
  }
}
