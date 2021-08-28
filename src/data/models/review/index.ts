import { IDatabaseConnector } from '@app/data/connection'
import { CreateReviewTable } from './ddl/create.table'
import { DropReviewTable } from './ddl/drop.table'
import { ISchemaAdaptor } from '../../adaptor/index'
import { FindReviewCountsByPlaceId } from './dml/find-review-counts-by-placeId'

interface IReview {
  uuid: string
  content: string
}

export interface IReviewModel extends ISchemaAdaptor {
  save: () => void
  remove: () => void
  findReviewCountsByPlaceId: (placeId: string) => Promise<number>
}

export const ReviewModel = (conn: IDatabaseConnector): IReviewModel => {
  const dropSchema = DropReviewTable(conn)
  const createSchema = CreateReviewTable(conn)
  const save = () => {}
  const remove = () => {}
  const findReviewCountsByPlaceId = FindReviewCountsByPlaceId(conn)

  return {
    createSchema,
    dropSchema,
    save,
    remove,
    findReviewCountsByPlaceId,
  }
}
