import { IDatabaseConnector } from "@app/data/connection"
import _Promise from 'bluebird'

export const CreatePlaceTable = (conn: IDatabaseConnector) => {
  return async () => {
    const db = conn.getConnection()

    const sql = `CREATE TABLE IF NOT EXISTS 
    PLACES (
      placeId VARCHAR PRIMARY KEY, 
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