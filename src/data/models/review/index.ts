import { ISchemaAdaptor } from '@app/data'
import { IDatabaseConnector } from '@app/data/connection'
import { CreateReviewTable } from './ddl/create.table'
import { DropReviewTable } from './ddl/drop.table'
import { Save } from './dml/cmd/impl'
import { FindReviewCountsByPlaceId } from './dml/query/impl/find-review-counts-by-placeId'
import _Promise from 'bluebird';

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

export interface IReviewModel extends ISchemaAdaptor {
  save: (review: IReview, id?: string) => Promise<void>
  remove: (reviewId: string) => Promise<void>
  removeAll: () => Promise<void>
  findReviewCountsByPlaceId: (placeId: string) => Promise<number>
}

export const ReviewModel = (conn: IDatabaseConnector): IReviewModel => {
  const dropSchema = DropReviewTable(conn)
  const createSchema = CreateReviewTable(conn)
  const save = Save(conn)
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

  return {
    createSchema,
    dropSchema,
    save,
    remove,
    removeAll,
    findReviewCountsByPlaceId,
  }
}
