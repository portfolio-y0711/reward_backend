import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateUserTable = (conn: IDatabaseConnector) => {
  return async () => {
    const db = conn.getConnection()

    const sql = `CREATE TABLE IF NOT EXISTS 
    USERS (
      userId VARCHAR PRIMARY KEY, 
      uuid VARCHAR,
      name VARCHAR
    )`

    new _Promise((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log('error running sql ' + sql)
        }
      })
    })
  }
}
