import { IEventDatabase } from '@app/data'
import { IReviewPointEvent } from '../..'
import { uuidv4 } from '@app/util'

export const DelReviewActionHandler = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    const reviewModel = db.getReviewModel()
    const isRewarded = await reviewModel.findReviewAndCheckRewarded(eventInfo['userId'])

    if (isRewarded) {
      const reviewRewardModel = db.getReviewRewardModel()
      const latestRewardRecord = await reviewRewardModel.findLatestUserReviewRewardByReviewId(
        eventInfo['userId'],
        eventInfo['reviewId'],
      )
      const diff = -latestRewardRecord.pointDelta

      await reviewRewardModel.save({
        rewardId: uuidv4(),
        reviewId: eventInfo['reviewId'],
        userId: eventInfo['userId'],
        operation: 'SUB',
        pointDelta: latestRewardRecord.pointDelta,
        reason: 'DEL',
      })
      const userModel = db.getUserModel()
      const currPoint = await userModel.findUserRewardPoint(eventInfo['userId'])
      await userModel.updateReviewPoint(eventInfo['userId'], currPoint + diff)
    }
  }
}
