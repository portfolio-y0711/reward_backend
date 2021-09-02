import { IEventDatabase } from '@app/data'
import { uuidv4 } from '@app/util'
import { IReviewPointEvent } from '@app/services/event/review/actions'
import { REWARD_OPERATION, REWARD_REASON } from '@app/typings'
import { BooleanCode } from '@app/data/models/review'
import { runBatchAsync } from '@app/util/transaction'
import { appLogger } from '@app/util/applogger'

export const ModReviewActionHandler = (db: IEventDatabase) => {
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

      const placeModel = db.getPlaceModel()
      const bonusPoint = await placeModel.findBonusPoint(eventInfo['placeId'])

      appLogger.info(` ▶ bonusPoint counts: ${bonusPoint}`)

      const totalPoint =
        (eventInfo['content'].length > 1 ? 1 : 0) +
        (eventInfo['attachedPhotoIds'].length > 1 ? 1 : 0) +
        bonusPoint

      appLogger.info(` ▶ total point : ${totalPoint}`)

      const diff = totalPoint - latestRewardRecord.pointDelta
      appLogger.info(` ▶ point diff: ${diff}`)

      if (diff != 0) {
        const subtract_operation: REWARD_OPERATION = 'SUB'
        const subtract_reason: REWARD_REASON = 'MOD'
        const subtract_reward_param = [
          uuidv4(),
          eventInfo['userId'],
          eventInfo['reviewId'],
          subtract_operation,
          latestRewardRecord.pointDelta,
          subtract_reason,
        ]

        const add_operation: REWARD_OPERATION = 'ADD'
        const add_reason: REWARD_REASON = 'MOD'
        const add_reward_param = [
          uuidv4(),
          eventInfo['userId'],
          eventInfo['reviewId'],
          add_operation,
          totalPoint,
          add_reason,
        ]

      const userModel = db.getUserModel()
      const currPoint = await userModel.findUserRewardPoint(eventInfo['userId'])

      appLogger.info(` ▶ transaction started ------------------------------------BEGIN`)
        const transactionCmds: any[] = [
          [
            `INSERT INTO REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES(?, ?, ?, ?, ?, ?);`,
            ...subtract_reward_param,
          ],
          [
            `INSERT INTO REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES(?, ?, ?, ?, ?, ?);`,
            ...add_reward_param,
          ],
          [
            `UPDATE USERS SET rewardPoint = ? WHERE userID = ?;`,
            currPoint + diff,
            eventInfo['userId'],
          ],
          [
            `UPDATE REVIEWS SET content = ?, attachedPhotoIds = ? WHERE rewarded = ? AND reviewId = ? AND userId = ?;`,
            eventInfo['content'],
            eventInfo['attachedPhotoIds'].join(','),
            BooleanCode.True,
            eventInfo['reviewId'],
            eventInfo['userId'],
          ],
        ]

        const conn = db.getConnector()
        const results = await runBatchAsync(conn)(transactionCmds)

        if (results[0].changes > 0) appLogger.info(` [✔︎] REWARDS ${subtract_operation} record created`)
        if (results[1].changes > 0) appLogger.info(` [✔︎] REWARDS ${add_operation} record created`)
        if (results[2].changes > 0) appLogger.info(` [✔︎] USERS reward point updated`)
        if (results[3].changes > 0) appLogger.info(` [✔︎] REVIEWS review has been updated`)
        appLogger.info(` ▶ transaction finished -------------------------------------END\n`)
      }
    }
    return
  }
}
