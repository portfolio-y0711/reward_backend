import { IEventDatabase } from '@app/data'
import { IReviewPointEvent } from '../..'
import { BooleanCode } from '@app/data/models/review'
import { uuidv4 } from '@app/util'
import { runBatchAsync } from '@app/util/transaction'
import { REWARD_OPERATION, REWARD_REASON } from '@app/typings'
import { appLogger } from '@app/util/applogger'

export const AddReviewActionHandler = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    appLogger.info(`[EVENT: ${eventInfo.type}/${eventInfo.action}] started process ============================`)
    const reviewModel = db.getReviewModel()
    const reviewCount = await reviewModel.findReviewCountsByPlaceId(eventInfo['placeId']) 
    const isRewardable = (reviewCount) == 0

    appLogger.info(` ▶︎ place id  : ${eventInfo['placeId']}`)
    appLogger.info(` ▶ review counts: ${reviewCount} ${isRewardable ? ', rewardable': 'not rewardable'}`)

    if (isRewardable) {
      const placeModel = db.getPlaceModel()
      const bonusPoint = await placeModel.findBonusPoint(eventInfo['placeId'])

      appLogger.info(` ▶ bonusPoint counts: ${bonusPoint}`)
      const totalpoint =
        (eventInfo['content'].length > 1 ? 1 : 0) +
        (eventInfo['attachedPhotoIds'].length > 1 ? 1 : 0) +
        bonusPoint
      appLogger.info(` ▶ total point : ${totalpoint}`)

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

      appLogger.info(` ▶ transaction started ------------------------------------BEGIN`)
      const transactionCmds: any[] = [
        [
          `INSERT INTO REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES(?, ?, ?, ?, ?, ?);`,
          ...rewardParam,
        ],
        [`UPDATE USERS SET rewardPoint = ? WHERE userID = ?;`, totalpoint, eventInfo['userId']],
        [
          `INSERT INTO REVIEWS(reviewId,placeId,content,attachedPhotoIds,userId,rewarded) VALUES(?,?,?,?,?,?);`,
          eventInfo['reviewId'],
          eventInfo['placeId'],
          eventInfo['content'],
          eventInfo['attachedPhotoIds'].join(),
          eventInfo['userId'],
          BooleanCode.True,
        ],
      ]

      const conn = db.getConnector()
      const results = await runBatchAsync(conn)(transactionCmds)

      if (results[0].changes > 0) appLogger.info(` [✔︎] REWARDS record created`)
      if (results[1].changes > 0) appLogger.info(` [✔︎] USERS reward point updated`)
      if (results[2].changes > 0) appLogger.info(` [✔︎] REVIEWS review has been created`)

      appLogger.info(` ▶ transaction finished -------------------------------------END\n`)
    }
  }
}
