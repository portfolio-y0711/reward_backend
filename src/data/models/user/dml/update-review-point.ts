import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const UpdateReviewPoint = (conn: IDatabaseConnector) => {
  return async (userId: string, points: number) => {
    const db = await conn.getConnection()
    const sql = `UPDATE USERS SET rewardPoint = '${points}' WHERE userID = '${userId}'`
    return await new _Promise<number>((res, rej) => {
      db.run(sql, function (this, err) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(points)
        }
      })
    })
  }
}
