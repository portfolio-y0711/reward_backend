import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const RemoveAll = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()
    const sql = `delete from USERS`
    return new _Promise<void>((res, rej) => {
      db.run(sql, function (this, err) {
        if (err) {
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res()
        }
      })
    })
  }
}
