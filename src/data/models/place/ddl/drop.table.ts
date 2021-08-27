import { IDatabaseConnector } from '@app/data/connection'
import _Promise from 'bluebird'

export const DropPlaceTable = (conn: IDatabaseConnector) => {
  return async () => {
    const db = conn.getConnection()
    const sql = `DROP TABLE IF EXISTS PLACES`

    new _Promise((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log('error running sql ' + sql)
        }
      })
    })
  }
}
