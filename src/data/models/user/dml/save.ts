import { IDatabaseConnector } from '@app/data/connection'
import { IUser } from '../index'
import _Promise from 'bluebird'
import { uuidv4 } from '@app/util'

export const Save = (conn: IDatabaseConnector) => {
  return async (user: IUser, id?: string) => {
    const db = await conn.getConnection()
    const { userId, name, rewardPoint } = user
    const sql = `INSERT INTO USERS(userId,name,rewardPoint) VALUES('${
      userId ?? uuidv4()
    }', '${name}', '${rewardPoint}')`
    // const sql = `INSERT INTO USERS VALUES('${userId ?? uuidv4()}', '${name}', 'null')`
    return new _Promise<void>((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res()
        }
      })
    })
  }
}
