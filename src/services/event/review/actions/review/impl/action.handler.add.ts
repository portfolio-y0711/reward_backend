import { IEventDatabase } from '@app/data'
import { IReviewPointEvent } from '../..'
import { BooleanCode } from '@app/data/models/review'
import { uuidv4 } from '@app/util'

export const AddReviewActionHandler = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    const reviewModel = db.getReviewModel()
    const isRewardable = (await reviewModel.findReviewCountsByPlaceId(eventInfo['placeId'])) == 0

    if (isRewardable) {
      const placeModel = db.getPlaceModel()
      const bonusPoint = await placeModel.findBonusPoint(eventInfo['placeId'])
      const totalpoint =
        (eventInfo['content'].length > 1 ? 1 : 0) +
        (eventInfo['attachedPhotoIds'].length > 1 ? 1 : 0) +
        bonusPoint
      const userRewardModel = db.getReviewRewardModel()
      await userRewardModel.save({
        rewardId: uuidv4(),
        userId: eventInfo['userId'],
        reviewId: eventInfo['reviewId'],
        operation: 'ADD',
        pointDelta: totalpoint,
        reason: 'NEW',
      })
      const userModel = db.getUserModel()
      await userModel.updateReviewPoint(eventInfo['userId'], totalpoint)
    }
    await reviewModel.save({
      reviewId: eventInfo['reviewId'],
      content: eventInfo['content'],
      attachedPhotoIds: eventInfo['attachedPhotoIds'],
      placeId: eventInfo['placeId'],
      rewarded: isRewardable ? BooleanCode.True : BooleanCode.False,
      userId: eventInfo['userId'],
    })
  }
}