import { IEventDatabase } from '@app/data'
import { IReviewPointEvent } from '../..'
import { BooleanCode } from '@app/data/models/review'
import { uuidv4 } from '@app/util'
import { runBatchAsync } from '@app/util/transaction'
import { REWARD_OPERATION, REWARD_REASON } from '@app/data/models/user-review-reward/index'

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

      const operation: REWARD_OPERATION = 'ADD'
      const reason: REWARD_REASON = 'NEW'
      const rewardParam = [
        uuidv4(),
        eventInfo['userId'],
        eventInfo['reviewId'],
        operation,
        totalpoint,
        reason,
      ]

      const transactionCmds: any[] = [
        [
          `INSERT INTO USERS_REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES(?, ?, ?, ?, ?, ?);`,
          ...rewardParam,
        ],
        [`UPDATE USERS SET rewardPoint = ? WHERE userID = ?;`, totalpoint, eventInfo['userId']],
        [
          `INSERT INTO PLACES_REVIEWS(reviewId,placeId,content,attachedPhotoIds,userId,rewarded) VALUES(?,?,?,?,?,?);`,
          uuidv4(),
          eventInfo['placeId'],
          eventInfo['content'],
          eventInfo['attachedPhotoIds'].join(),
          eventInfo['userId'],
          BooleanCode.True,
        ],
      ]

      const conn = db.getConnector()
      await runBatchAsync(conn)(transactionCmds)
    }
  }
}
