import { IDatabaseConnector } from '@app/data/connection'
import _Promise from 'bluebird'

export const CreatePlaceTable = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sql = `CREATE TABLE IF NOT EXISTS 
    PLACES (
      placeId VARCHAR PRIMARY KEY, 
      country VARCHAR NOT NULL,
      name VARCHAR NOT NULL,
      bonusPoint INTEGER NOT NULL,
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
