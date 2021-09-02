import { IDatabaseConnector } from "@app/data/connection"

export const CheckRecordExistsByReviewId
  = (conn: IDatabaseConnector) => {
    return async (reviewId: string) => {
      const db = await conn.getConnection()
      const sql = `SELECT * FROM REVIEWS WHERE reviewId = '${reviewId}'`
      return new Promise<boolean>((res, rej) => {
        db.get(sql, function (this, err, row) {
          if (err) {
            console.log(err.message)
            console.log('error running sql ' + sql)
            rej(err.message)
          } else {
            if (!row) {
              res(false)
            } else {
              res(true)
            }
          }
        })
      })
    }
  }