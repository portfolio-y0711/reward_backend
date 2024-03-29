import { IEventDatabase } from '@app/data'
import { IReviewPointEvent } from '../..'
import { uuidv4 } from '@app/util'
import { BooleanCode } from '@app/data/models/review'
import { runBatchAsync } from '@app/util/transaction'
import { ContextError, REWARD_OPERATION, REWARD_REASON } from '@app/typings'
import { appLogger } from '@app/util/applogger'

export const DelReviewActionHandler = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    appLogger.info(`[EVENT: ReviewEventActionHandler (${eventInfo.action})] started process ======================START`)

    const reviewModel = db.getReviewModel()
    const existRecord = await reviewModel.checkRecordExistsByReviewId(eventInfo['reviewId'])

    if (!existRecord) {
      appLogger.error(`no record exists by that reviewId`)
      throw ContextError.contextError('no record exists by that reviewId', 422)
    }

    const isRewarded = await reviewModel.findReviewAndCheckRewarded(
      eventInfo['userId'],
      eventInfo['reviewId'],
    )

    appLogger.info(` ▶︎ review id  : ${eventInfo['reviewId']}`)
    appLogger.info(` ▶︎ place id  : ${eventInfo['placeId']}`)
    appLogger.info(` ▶ was review rewarded?: ${isRewarded ? 'YES' : 'NO'} `)

    if (isRewarded) {
      const reviewRewardModel = db.getReviewRewardModel()
      const latestRewardRecord = await reviewRewardModel.findLatestUserReviewRewardByReviewId(
        eventInfo['userId'],
        eventInfo['reviewId'],
      )

      appLogger.info(` ▶ search latest reward record with 'userId' and 'reviewId'`)
      appLogger.info(`   review id: ${latestRewardRecord.reviewId}`)
      appLogger.info(`   reason: ${latestRewardRecord.reason} review`)
      appLogger.info(`   operation: ${latestRewardRecord.operation} ${latestRewardRecord.pointDelta}`)

      const deductPoint = -latestRewardRecord.pointDelta

      appLogger.info(` ▶ points to deduct: ${deductPoint}`)

      const userModel = db.getUserModel()
      const currPoint = await userModel.findUserRewardPoint(eventInfo['userId'])

      appLogger.info(`   user's current rewards point: ${currPoint}`)
      appLogger.info(`   user's next rewards point: ${currPoint + deductPoint}`)

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
          currPoint + deductPoint,
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

      if (results[0].changes > 0) appLogger.info(` [✔︎] REWARDS deduction record created`)
      if (results[1].changes > 0) appLogger.info(` [✔︎] USERS total reward point updated`)
      if (results[2].changes > 0) appLogger.info(` [✔︎] REVIEWS review has been deleted`)

      appLogger.info(` ▶ transaction finished -------------------------------------END\n`)
    }
    appLogger.info(`===================================================================================END`)
    return
  }
}
