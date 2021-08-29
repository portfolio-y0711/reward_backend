import { IDatabaseConnector } from '@app/data/connection'

export const FindReviewCountsByPlaceId = (conn: IDatabaseConnector) => {
  return async (id: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT count(*) FROM PLACES_REVIEWS WHERE placeId = '${id}'`

    return new Promise<number>((res, rej) => {
      return db.get(sql, function (this, err, row) {
        if (err) {
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(row['count(*)'])
        }
      })
    })
  }
}
