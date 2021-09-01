import { IDatabaseConnector } from '@app/data/connection'
import _Promise from 'bluebird'

export const FindUserRewardPoint = (conn: IDatabaseConnector) => {
  return async (userId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT rewardPoint FROM USERS WHERE userId = '${userId}'`
    return new _Promise<number>((res, rej) => {
      db.get(sql, function (this, err, row) {
        if (err) {
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(row.rewardPoint)
        }
      })
    })
  }
}
