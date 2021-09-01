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

export interface IReviewRewardModel extends ISchemaAdaptor {
  save: (user: IReviewReward, userId?: string) => Promise<void>
  remove: () => Promise<void>
  removeAll: () => Promise<void>
  createIndex: () => Promise<void>
  createSchema: () => Promise<void>
  findUserReviewRewardsByUserId: (userId: string) => Promise<IReviewReward[]>
  findLatestUserReviewRewardByReviewId: (userId: string, reviewId: string) => Promise<IReviewReward>
}

export interface IReviewReward {
  id?: string
  rewardId: string
  userId: string
  reviewId: string
  operation: REWARD_OPERATION
  pointDelta: number
  reason: REWARD_REASON
}

export const ReviewRewardModel = (conn: IDatabaseConnector): IReviewRewardModel => {
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
