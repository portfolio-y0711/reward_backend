import { IDatabaseConnector } from '@app/data/connection'
import _Promise from 'bluebird'

export const RemoveAll = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()
    const sql = `DELETE FROM PLACES`
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
