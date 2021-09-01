import { IDatabaseConnector } from '@app/data/connection'
import { IUser } from '../index'
import _Promise from 'bluebird'

export const FindUsers = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()
    const sql = `SELECT * FROM USERS`
    return new _Promise<IUser[]>((res, rej) => {
      db.all(sql, function (err, result) {
        res(result)
        if (err) {
          console.log('error running sql ' + sql)
        }
      })
    })
  }
}
