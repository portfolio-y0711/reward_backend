import { IEventDatabase } from '@app/data'
import { IReviewPointEvent } from '../..'
import { uuidv4 } from '@app/util'
import { BooleanCode } from '@app/data/models/review'
import { runBatchAsync } from '@app/util/transaction'
import { REWARD_OPERATION, REWARD_REASON } from '@app/typings'
import { appLogger } from '@app/util/applogger'

export const DelReviewActionHandler = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    appLogger.info(`[EVENT: ${eventInfo.type}/${eventInfo.action}] started process ============================`)
    const reviewModel = db.getReviewModel()
    const isRewarded = await reviewModel.findReviewAndCheckRewarded(
      eventInfo['userId'],
      eventInfo['reviewId'],
    )

    appLogger.info(` ▶︎ review id  : ${eventInfo['reviewId']}`)
    appLogger.info(` ▶︎ place id  : ${eventInfo['placeId']}`)
    appLogger.info(` ▶ review rewarded?: ${isRewarded ? 'YES' : 'NO'} `)

    if (isRewarded) {
      const reviewRewardModel = db.getReviewRewardModel()
      const latestRewardRecord = await reviewRewardModel.findLatestUserReviewRewardByReviewId(
        eventInfo['userId'],
        eventInfo['reviewId'],
      )

      appLogger.info(` ▶ latest reward record`)
      appLogger.info(`   ◻ review id: ${latestRewardRecord.reviewId}`)
      appLogger.info(`   ◻︎ reason: ${latestRewardRecord.reason} review`)
      appLogger.info(`   ◻︎ operation: ${latestRewardRecord.operation} ${latestRewardRecord.pointDelta}`)

      const diff = -latestRewardRecord.pointDelta

      appLogger.info(` ▶ point diff: ${diff}`)

      const userModel = db.getUserModel()
      const currPoint = await userModel.findUserRewardPoint(eventInfo['userId'])

      appLogger.info(` ▶ user's current rewards point: ${currPoint}`)

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

      appLogger.info(` ▶ transaction started ------------------------------------BEGIN`)
      const transactionCmds: any[] = [
        [
          `INSERT INTO REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES(?, ?, ?, ?, ?, ?);`,
          ...subtract_reward_param,
        ],
        [
          `UPDATE USERS SET rewardPoint = ? WHERE userID = ?;`,
          currPoint + diff,
          eventInfo['userId'],
        ],
        [
          `DELETE FROM REVIEWS WHERE rewarded = ? AND reviewId = ? AND userId = ?;`,
          BooleanCode.True,
          eventInfo['reviewId'],
          eventInfo['userId'],
        ],
      ]
      const conn = db.getConnector()
      const results = await runBatchAsync(conn)(transactionCmds)

      if (results[0].changes > 0) appLogger.info(` [✔︎] REWARDS record revoked`)
      if (results[1].changes > 0) appLogger.info(` [✔︎] USERS reward point updated`)
      if (results[2].changes > 0) appLogger.info(` [✔︎] REVIEWS review has been deleted`)

      appLogger.info(` ▶ transaction finished -------------------------------------END\n`)
    }
  }
}
