import { AddReviewActionHandler } from './review/impl/action.handler.add'
import { DelReviewActionHandler } from './review/impl/action.handler.delete'
import { ModReviewActionHandler } from './review/impl/action.handler.mod'

import { IEventDatabase } from '@app/data'
import { IReviewEventActionHandlers } from './index'

export const reviewEventActionRoutes
  = (db: IEventDatabase): IReviewEventActionHandlers => {
    return {
      "ADD": AddReviewActionHandler(db),
      "MOD": ModReviewActionHandler(db),
      "DELETE": DelReviewActionHandler(db),
    }
  }