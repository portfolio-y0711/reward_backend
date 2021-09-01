import { IEventDatabase } from '@app/data'
import { uuidv4 } from '@app/util'
import { IReviewPointEvent } from '@app/services/event/review/actions'
import { REWARD_OPERATION, REWARD_REASON } from '@app/typings'
import { BooleanCode } from '@app/data/models/review'
import { runBatchAsync } from '@app/util/transaction'

export const ModReviewActionHandler = (db: IEventDatabase) => {
  return async (eventInfo: IReviewPointEvent) => {
    const reviewModel = db.getReviewModel()

    const isRewarded = await reviewModel.findReviewAndCheckRewarded(
      eventInfo['userId'],
      eventInfo['reviewId'],
    )

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
        await userModel.updateReviewPoint(eventInfo['userId'], currPoint + diff)

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
        await runBatchAsync(conn)(transactionCmds)
      }
    }
    return
  }
}
