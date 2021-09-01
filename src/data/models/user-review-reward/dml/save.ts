import { IDatabaseConnector } from '@app/data/connection'
import { uuidv4 } from '@app/util'
import { IReviewReward } from '../index'
import _Promise from 'bluebird'

export const Save = (conn: IDatabaseConnector) => {
  return async (userReward: IReviewReward, id?: string) => {
    const db = await conn.getConnection()
    const { rewardId, userId, reviewId, operation, pointDelta, reason } = userReward
    const sql = `INSERT INTO USERS_REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES('${
      rewardId ?? uuidv4()
    }', '${userId}', '${reviewId}', '${operation}', '${pointDelta}', '${reason}')`
    return new _Promise<void>((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res()
        }
      })
    })
  }
}
