import { IDatabase } from '@app/data'
import { ReviewEventHandler } from './handler.review-event'

export interface IHandlers {
  [name: string]: any
}

export const Handlers
  = (context: { db: IDatabase }) => {
    const { db } = context
    return {
      REVIEW: ReviewEventHandler(db),
    }
  }
