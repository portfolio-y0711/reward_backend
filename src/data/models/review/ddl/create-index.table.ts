import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateReviewTableIndex = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sqls = [
      `CREATE INDEX IF NOT EXISTS index_reviews_rewarded ON REVIEWS(rewarded)`
    ]

    await _Promise.all(
      sqls.map((sql) => {
        return new _Promise((res, rej) => {
          return db.run(sql, function (err) {
            if (err) {
              console.log('error running sql ' + sql)
              rej(err.message)
            } else {
              res()
            }
          })
        })
      }),
    )

  }
}
