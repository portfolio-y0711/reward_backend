import { IDatabaseConnector } from '@app/data/connection'
import _Promise from 'bluebird'

export const DropUserRewardTable = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()
    const sql = `DROP TABLE IF EXISTS REWARDS`

    new _Promise((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log('error running sql ' + sql)
        }
      })
    })
  }
}
