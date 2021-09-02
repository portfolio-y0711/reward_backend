import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateUserTableIndex = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sql = `CREATE UNIQUE INDEX IF NOT EXISTS index_users_name ON users(name)`

    new _Promise((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log('error running sql ' + sql)
        }
      })
    })
  }
}
