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
import { RemoveAll } from './dml/cmd/impl/remove-all'
import { CheckRecordExistsByReviewId } from './dml/query/impl/check-record-exitsts-by-review-id'
import { FindReviewByReviewId } from './dml/query/impl/find-review-by-review-record'
import { CreateReviewTableIndex } from './ddl/create-index.table';

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
  findReviewAndCheckRewarded: (userId: string, reviewId: string) => Promise<boolean>
  findReviewByReviewId: (reviewId: string) => Promise<IReview>
  checkRecordExistsByReviewId: (reviewId: string) => Promise<boolean>
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
  const createIndex = CreateReviewTableIndex(conn)
  const save = Save(conn)
  const checkRecordExistsByReviewId = CheckRecordExistsByReviewId(conn)
  const updateRewardedReview = UpdateRewardedReview(conn)
  const remove = async (reviewId: string) => {}
  const removeAll = RemoveAll(conn)
  const findReviewCountsByPlaceId = FindReviewCountsByPlaceId(conn)
  const findReviewAndCheckRewarded = FindReviewAndCheckRewarded(conn)
  const findReviewByReviewId = FindReviewByReviewId(conn)

  return {
    createSchema,
    dropSchema,
    updateRewardedReview,
    checkRecordExistsByReviewId,
    save,
    createIndex,
    remove,
    removeAll,
    findReviewCountsByPlaceId,
    findReviewAndCheckRewarded,
    findReviewByReviewId
  }
}
