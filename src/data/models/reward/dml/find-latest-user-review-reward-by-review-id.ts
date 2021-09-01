import { IDatabaseConnector } from '@app/data/connection'
import { IRewardRecord } from '../index'
import { REWARD_OPERATION } from '@app/typings'
import _Promise from 'bluebird'

export const FindLatestUserReviewRewardByReviewId = (conn: IDatabaseConnector) => {
  return async (userId: string, reviewId: string) => {
    const db = await conn.getConnection()
    const operation: REWARD_OPERATION = 'ADD'
    const sql = `SELECT * FROM USERS_REWARDS WHERE operation = '${operation}' AND userId = '${userId}' AND reviewId = '${reviewId}' ORDER BY timestamp DESC LIMIT 1`
    return new _Promise<IRewardRecord>((res, rej) => {
      db.get(sql, function (this, err, record) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(record)
        }
      })
    })
  }
}
