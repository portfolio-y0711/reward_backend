import { IEventDatabase } from '@app/data'
import { uuidv4 } from '@app/util'
import { IReviewPointEvent } from '@app/services/event/review/actions'

export const ModReviewActionHandler = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    const reviewModel = db.getReviewModel()

    const isRewarded = await reviewModel.findReviewAndCheckRewarded(eventInfo['userId'], eventInfo['reviewId'])

    if (isRewarded) {
      const placeModel = db.getPlaceModel()
      const bonusPoint = await placeModel.findBonusPoint(eventInfo['placeId'])

      const totalPoint =
        (eventInfo['content'].length > 1 ? 1 : 0) +
        (eventInfo['attachedPhotoIds'].length > 1 ? 1 : 0) +
        bonusPoint

      const reviewRewardModel = db.getReviewRewardModel()
      const latestRewardRecord = await reviewRewardModel.findLatestUserReviewRewardByReviewId(
        eventInfo['userId'],
        eventInfo['reviewId'],
      )

      const diff = totalPoint - latestRewardRecord.pointDelta

      if (diff != 0) {
        await reviewRewardModel.save({
          rewardId: uuidv4(),
          reviewId: eventInfo['reviewId'],
          userId: eventInfo['userId'],
          operation: 'SUB',
          pointDelta: latestRewardRecord.pointDelta,
          reason: 'MOD',
        })

        await new Promise((res) => setTimeout(res, 1000))

        await reviewRewardModel.save({
          rewardId: uuidv4(),
          reviewId: eventInfo['reviewId'],
          userId: eventInfo['userId'],
          operation: 'ADD',
          pointDelta: totalPoint,
          reason: 'MOD',
        })

        const userModel = db.getUserModel()
        const currPoint = await userModel.findUserRewardPoint(eventInfo['userId'])
        await userModel.updateReviewPoint(eventInfo['userId'], currPoint + diff)
      }
    }
  }
}
