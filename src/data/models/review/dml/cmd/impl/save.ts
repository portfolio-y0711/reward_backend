import { IDatabaseConnector } from '@app/data/connection'
import { uuidv4 } from '@app/util'
import { IReview } from '../../../index'
import _Promise from 'bluebird'

export const Save = (conn: IDatabaseConnector) => {
  return async (review: IReview) => {
    const db = await conn.getConnection()
    const { reviewId, placeId, content, attachedPhotoIds, userId, rewarded } = review

    const sql = `INSERT INTO REVIEWS(reviewId,placeId,content,attachedPhotoIds,userId,rewarded) VALUES('${
      reviewId ?? uuidv4()
    }','${placeId}', '${content}', '${attachedPhotoIds.join(',')}', '${userId}', '${rewarded}')`

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
