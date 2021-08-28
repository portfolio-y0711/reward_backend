import { IDatabase } from '@app/data'

export interface IReviewPointEvent {
  action: string
  reviewId: string
  content: string
  attachedPhotoIds: string[]
  userId: string
  placeId: string
}

export interface IReviewEventHandler {
  (eventInfo: IReviewPointEvent): void
}

export const ReviewEventHandler
  = (db: IDatabase) => {
    return (eventInfo: IReviewPointEvent) => {
      const actions: { [name: string]: any } = {
        ADD: () => { },
        MOD: () => { },
        DELETE: () => { },
      }
      const reviewModel = db.getReviewModel()
      reviewModel.findReviewCountsByPlaceId(eventInfo.placeId)

      const placeModel = db.getPlaceModel()
      placeModel.findBonusPoint(eventInfo.placeId)

      let isPointRewardable = true
      // const isPointRewardable = checkPointsAvailable(placeId)
      if (isPointRewardable) {
        const { content, attachedPhotoIds } = eventInfo
        const points = (content.length > 1 ? 1 : 0) + (attachedPhotoIds.length > 1 ? 1 : 0)

        const userModel = db.getUserModel()
        userModel.saveReviewPoint(eventInfo.userId, points)
      }
    }
  }
