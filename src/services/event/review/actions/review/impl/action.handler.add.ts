import { IEventDatabase } from '@app/data'
import { BooleanCode } from '@app/data/models/review'
import { uuidv4 } from '@app/util'
import { runBatchAsync } from '@app/util/transaction'
import { REWARD_OPERATION, REWARD_REASON, ContextError } from '@app/typings';
import { appLogger } from '@app/util/applogger'
import { IReviewPointEvent } from '@app/services/event/review/actions'

export const AddReviewActionHandler = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    appLogger.info(`[EVENT: ReviewEventActionHandler (${eventInfo.action})] started process ========================START`)
    const reviewModel = db.getReviewModel()

    const isDuplicate = await reviewModel.checkRecordExistsByReviewId(eventInfo['reviewId'])
    
    if (isDuplicate) {
      appLogger.error(`duplicate record exist by that reviewId`)
      throw ContextError.contextError('duplicate record exist by that reviewId', 422)
    }

    const reviewCount = await reviewModel.findReviewCountsByPlaceId(eventInfo['placeId']) 
    const isRewardable = (reviewCount) == 0

    appLogger.info(` ▶︎ place id  : ${eventInfo['placeId']}`)
    appLogger.info(`   review counts: ${reviewCount}`)
    appLogger.info(` ▶ review rewardable?: ${isRewardable ? 'YES': 'NO'}`)

    if (isRewardable) {
      const placeModel = db.getPlaceModel()
      const bonusPoint = await placeModel.findBonusPoint(eventInfo['placeId'])

      appLogger.info(` ▶ calculate review points`)
      appLogger.info(`   bonusPoint: ${bonusPoint}`)

      let contentPoint: number
      let photosPoint: number

      const addPoint =
        (contentPoint = eventInfo['content'].length > 1 ? 1 : 0) +
        (photosPoint = eventInfo['attachedPhotoIds'].length > 1 ? 1 : 0) +
        bonusPoint

      appLogger.info(`   + content point: ${contentPoint}`)
      appLogger.info(`   + photos point: ${photosPoint}`)
      appLogger.info(`   = total point : ${addPoint}`)

      const userModel = db.getUserModel()
      const currPoint = await userModel.findUserRewardPoint(eventInfo['userId'])

      appLogger.info(`   user's current rewards point: ${currPoint}`)
      appLogger.info(`   user's next rewards point: ${currPoint + addPoint}`)

      const add_operation: REWARD_OPERATION = 'ADD'
      const add_reason: REWARD_REASON = 'NEW'
      const add_rewardParam = [
        uuidv4(),
        eventInfo['userId'],
        eventInfo['reviewId'],
        add_operation,
        addPoint,
        add_reason,
      ]

      appLogger.info(` ▶ transaction started ------------------------------------BEGIN`)
      const transactionCmds: any[] = [
        [
          `INSERT INTO REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES(?, ?, ?, ?, ?, ?);`,
          ...add_rewardParam,
        ],
        [`UPDATE USERS SET rewardPoint = ? WHERE userID = ?;`, currPoint + addPoint, eventInfo['userId']],
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

      if (results[0].changes > 0) appLogger.info(` [✔︎] REWARDS ${add_operation} record created`)
      if (results[1].changes > 0) appLogger.info(` [✔︎] USERS total reward point updated`)
      if (results[2].changes > 0) appLogger.info(` [✔︎] REVIEWS review has been created`)

      const rewardModel = db.getReviewRewardModel()
      appLogger.info(` ▶ transaction finished -------------------------------------END`)
    }
    appLogger.info(`===================================================================================END`)
    return
  }
}
