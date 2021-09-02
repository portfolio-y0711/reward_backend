import { IDatabaseConnector } from '@app/data/connection'
import { CreateUserRewardTable } from './ddl/create.table'
import { DropUserRewardTable } from './ddl/drop.table'
import _Promise from 'bluebird'
import { ISchemaAdaptor } from '@app/data'
import { CreateUserRewardTableIndex } from './ddl/create-index.table'
import { FindUserReviewRewardsByUserId } from './dml/find-user-review-rewards-by-userId'
import { FindLatestUserReviewRewardByReviewId } from './dml/find-latest-user-review-reward-by-review-id'
import { REWARD_OPERATION, REWARD_REASON } from '@app/typings'
import { Save } from './dml/save'
import { RemoveAll } from './dml/remove-all'

export interface IRewardQuery {
  findUserReviewRewardsByUserId: (userId: string) => Promise<IRewardRecord[]>
  findLatestUserReviewRewardByReviewId: (userId: string, reviewId: string) => Promise<IRewardRecord>
}
export interface IRewardCommand {
  save: (user: IRewardRecord, userId?: string) => Promise<void>
  remove: () => Promise<void>
  removeAll: () => Promise<void>
}

export interface IRewardModel extends ISchemaAdaptor, IRewardQuery, IRewardCommand { }

export interface IRewardRecord {
  id?: string
  rewardId: string
  userId: string
  reviewId: string
  operation: REWARD_OPERATION
  pointDelta: number
  reason: REWARD_REASON
}

export const ReviewRewardModel = (conn: IDatabaseConnector): IRewardModel => {
  const dropSchema = DropUserRewardTable(conn)
  const createSchema = CreateUserRewardTable(conn)
  const createIndex = CreateUserRewardTableIndex(conn)
  const save = Save(conn)
  const remove = async () => {}
  const removeAll = RemoveAll(conn)
  const findUserReviewRewardsByUserId = FindUserReviewRewardsByUserId(conn)
  const findLatestUserReviewRewardByReviewId = FindLatestUserReviewRewardByReviewId(conn)

  return {
    createSchema,
    dropSchema,
    createIndex,
    save,
    findUserReviewRewardsByUserId,
    findLatestUserReviewRewardByReviewId,
    remove,
    removeAll,
  }
}
