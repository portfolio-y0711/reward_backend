import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateReviewTable = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()
    const sql = `CREATE TABLE IF NOT EXISTS 
    REVIEWS (
      reviewId VARCHAR PRIMARY KEY, 
      uuid VARCHAR,
      name VARCHAR,
      category VARCHAR,
      userId INTEGER,
      targetId INTEGER
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
