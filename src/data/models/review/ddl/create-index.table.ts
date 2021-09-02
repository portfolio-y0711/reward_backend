import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateReviewTableIndex = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sql = `CREATE UNIQUE INDEX IF NOT EXISTS index_reviews_rewarded ON REVIEWS(rewarded)`

    new _Promise((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log('error running sql ' + sql)
        }
      })
    })
  }
}
