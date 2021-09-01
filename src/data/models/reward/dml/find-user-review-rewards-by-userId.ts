import { IDatabaseConnector } from '@app/data/connection'
import _Promise from 'bluebird'
import { IRewardRecord } from '@app/data/models/reward'

export const FindUserReviewRewardsByUserId = (conn: IDatabaseConnector) => {
  return async (userId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT * FROM USERS_REWARDS WHERE userId = '${userId}'`
    return new _Promise<IRewardRecord[]>((res, rej) => {
      db.all(sql, function (this, err, records) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(records)
        }
      })
    })
  }
}
