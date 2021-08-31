import { IDatabaseConnector } from '@app/data/connection'
import { BooleanCode } from '../../..'

export const FindReviewCountsByPlaceId = (conn: IDatabaseConnector) => {
  return async (id: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT count(*) FROM PLACES_REVIEWS WHERE placeId = '${id}'`

    return new Promise<number>((res, rej) => {
      return db.get(sql, function (this, err, row) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(row['count(*)'])
        }
      })
    })
  }
}

export const FindReviewAndCheckRewarded = (conn: IDatabaseConnector) => {
  return async (userId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT rewarded FROM PLACES_REVIEWS WHERE rewarded = '${BooleanCode.True}' AND userId = '${userId}'`
    let isRewarded = false

    return new Promise<boolean>((res, rej) => {
      return db.get(sql, function (this, err, row) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          isRewarded = (row['rewarded'] == BooleanCode.True) 
          res(isRewarded)
        }
      })
    })
  }
}
