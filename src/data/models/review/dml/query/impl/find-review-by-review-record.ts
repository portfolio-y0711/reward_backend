import { IDatabaseConnector } from "@app/data/connection"
import { IReview } from '@app/data/models/review'

export const FindReviewByReviewId = (conn: IDatabaseConnector) => {
  return async (reviewId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT * FROM REVIEWS WHERE reviewId = '${reviewId}'`

    return new Promise<IReview>((res, rej) => {
      return db.get(sql, function (this, err, row) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(row)
        }
      })
    })
  }
}