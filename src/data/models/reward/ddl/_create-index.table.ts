import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateUserRewardTableIndex = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sql = `CREATE UNIQUE INDEX idx_users_name ON REWARDS(name)`

    new _Promise((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log('error running sql ' + sql)
        }
      })
    })
  }
}
