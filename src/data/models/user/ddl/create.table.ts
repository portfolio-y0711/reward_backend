import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateUserTable = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sql = `CREATE TABLE IF NOT EXISTS 
    USERS (
      userId VARCHAR PRIMARY KEY, 
      name VARCHAR NOT NULL,
      rewardPoint INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    ) WITHOUT ROWID`

    new _Promise((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log('error running sql ' + sql)
        }
      })
    })
  }
}
