import { IDatabaseConnector } from '@app/data/connection'
import { BooleanCode, IReview } from '../../../index'
import _Promise from 'bluebird'

export const UpdateRewardedReview = (conn: IDatabaseConnector) => {
  return async (review: IReview) => {
    const db = await conn.getConnection()
    const { reviewId, content, attachedPhotoIds, rewarded } = review

    const sql = `UPDATE PLACES_REVIEWS SET content = '${content}', attachedPhotoIds = '${attachedPhotoIds.join(
      ',',
    )}', rewarded = '${rewarded}' WHERE rewarded = '${
      BooleanCode.True
    }' AND reviewId = '${reviewId}'`

    return new _Promise<void>((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res()
        }
      })
    })
  }
}
