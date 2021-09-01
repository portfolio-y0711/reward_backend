import _Promise from 'bluebird'
import { IUser } from '@app/data/models/user'
import { IDatabaseConnector } from '@app/data/connection'

export const FindUserById = (conn: IDatabaseConnector) => {
  return async (userId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT * FROM USERS WHERE userId = '${userId}'`
    return new _Promise<IUser>((res, rej) => {
      db.get(sql, function (this, err, row) {
        if (err) {
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(row)
        }
      })
    })
  }
}
