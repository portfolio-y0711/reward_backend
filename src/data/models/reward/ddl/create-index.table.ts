import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateUserRewardTableIndex = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sqls = [
      `CREATE INDEX IF NOT EXISTS index_rewards_reason ON REWARDS(reason);`
    ]

    await _Promise.all(
      sqls.map((sql) => {
        return new _Promise((res, rej) => {
          return db.run(sql, function (err) {
            if (err) {
              console.log('error running sql ' + sql)
              rej(err.message)
            } else {
              res()
            }
          })
        })
      }),
    )
  }
}
