import { IEventDatabase } from '@app/data'
import { IReviewPointEvent } from '../..'
import { uuidv4 } from '@app/util'
import { BooleanCode } from '@app/data/models/review'
import { runBatchAsync } from '@app/util/transaction'
import { REWARD_OPERATION, REWARD_REASON } from '@app/typings'

export const DelReviewActionHandler = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    const reviewModel = db.getReviewModel()
    const isRewarded = await reviewModel.findReviewAndCheckRewarded(
      eventInfo['userId'],
      eventInfo['reviewId'],
    )

    if (isRewarded) {
      const reviewRewardModel = db.getReviewRewardModel()
      const latestRewardRecord = await reviewRewardModel.findLatestUserReviewRewardByReviewId(
        eventInfo['userId'],
        eventInfo['reviewId'],
      )
      const diff = -latestRewardRecord.pointDelta

      const userModel = db.getUserModel()
      const currPoint = await userModel.findUserRewardPoint(eventInfo['userId'])

      const subtract_operation: REWARD_OPERATION = 'SUB'
      const subtract_reason: REWARD_REASON = 'DEL'
      const subtract_reward_param = [
        uuidv4(),
        eventInfo['userId'],
        eventInfo['reviewId'],
        subtract_operation,
        latestRewardRecord.pointDelta,
        subtract_reason,
      ]

      const transactionCmds: any[] = [
        [
          `INSERT INTO USERS_REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES(?, ?, ?, ?, ?, ?);`,
          ...subtract_reward_param,
        ],
        [
          `UPDATE USERS SET rewardPoint = ? WHERE userID = ?;`,
          currPoint + diff,
          eventInfo['userId'],
        ],
        [
          `DELETE FROM PLACES_REVIEWS WHERE rewarded = ? AND reviewId = ? AND userId = ?;`,
          BooleanCode.True,
          eventInfo['reviewId'],
          eventInfo['userId'],
        ],
      ]
      const conn = db.getConnector()
      await runBatchAsync(conn)(transactionCmds)
    }
  }
}
