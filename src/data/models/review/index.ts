import { ISchemaAdaptor } from '@app/data'
import { IDatabaseConnector } from '@app/data/connection'
import { CreateReviewTable } from './ddl/create.table'
import { DropReviewTable } from './ddl/drop.table'
import { Save } from './dml/cmd/impl'
import {
  FindReviewAndCheckRewarded,
  FindReviewCountsByPlaceId,
} from './dml/query/impl/find-review-counts-by-placeId'
import _Promise from 'bluebird'
import { UpdateRewardedReview } from './dml/cmd/impl/update'

export enum BooleanCode {
  True = 1,
  False = 0,
}

export interface IReview {
  id?: string
  reviewId: string
  placeId: string
  content: string
  attachedPhotoIds: string[]
  userId: string
  rewarded: BooleanCode
}

export interface IReviewModelQuery {
  findReviewCountsByPlaceId: (placeId: string) => Promise<number>
  findReviewAndCheckRewarded: (reviewId: string) => Promise<boolean>
}

export interface IReviewModelCommand {
  save: (review: IReview, id?: string) => Promise<void>
  updateRewardedReview: (review: IReview) => Promise<void>
  remove: (reviewId: string) => Promise<void>
  removeAll: () => Promise<void>
}

export interface IReviewModel extends ISchemaAdaptor, IReviewModelCommand, IReviewModelQuery {}

export const ReviewModel = (conn: IDatabaseConnector): IReviewModel => {
  const dropSchema = DropReviewTable(conn)
  const createSchema = CreateReviewTable(conn)
  const save = Save(conn)
  const updateRewardedReview = UpdateRewardedReview(conn)
  const remove = async (reviewId: string) => {}
  const removeAll = async () => {
    const db = await conn.getConnection()
    const sql = `DELETE FROM PLACES_REVIEWS`
    return new _Promise<void>((res, rej) => {
      db.run(sql, function (this, err) {
        if (err) {
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res()
        }
      })
    })
  }
  const findReviewCountsByPlaceId = FindReviewCountsByPlaceId(conn)
  const findReviewAndCheckRewarded = FindReviewAndCheckRewarded(conn)

  return {
    createSchema,
    dropSchema,
    updateRewardedReview,
    save,
    remove,
    removeAll,
    findReviewCountsByPlaceId,
    findReviewAndCheckRewarded,
  }
}
