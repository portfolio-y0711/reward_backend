import { IDatabaseConnector } from '@app/data/connection'
import { CreateUserRewardTable } from './ddl/create.table'
import { DropUserRewardTable } from './ddl/drop.table'
import _Promise from 'bluebird'
import { uuidv4 } from '@app/util'
import { ISchemaAdaptor } from '@app/data'
import { CreateUserRewardTableIndex } from './ddl/create-index.table'
import { FindUserReviewRewardsByUserId } from './dml/find-user-review-rewards-by-userId'

export interface IReviewRewardModel extends ISchemaAdaptor {
  save: (user: IReviewReward, userId?: string) => Promise<void>
  remove: () => Promise<void>
  removeAll: () => Promise<void>
  createIndex: () => Promise<void>
  createSchema: () => Promise<void>
  findUserReviewRewardsByUserId: (userId: string) => Promise<IReviewReward[]>
  findLatestUserReviewRewardByReviewId: (userId: string, reviewId: string) => Promise<IReviewReward>
}

export type REWARD_OPERATION = 'ADD' | 'SUB'

export type REWARD_REASON = 'NEW' | 'MOD' | 'DEL' | 'RED'

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

  const save = async (userReward: IReviewReward, id?: string) => {
    const db = await conn.getConnection()
    const { rewardId, userId, reviewId, operation, pointDelta, reason } = userReward
    const sql = `INSERT INTO USERS_REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES('${ rewardId ?? uuidv4() }', '${userId}', '${reviewId}', '${operation}', '${pointDelta}', '${reason}')`
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

  const remove = async () => {}

  const removeAll = async () => {
    const db = await conn.getConnection()
    const sql = `DELETE FROM USERS_REWARDS`

    db.run(sql, function (err) {
      if (err) {
        console.log(err.message)
        console.log('error running sql ' + sql)
      }
    })
  }
  const findUserReviewRewardsByUserId = FindUserReviewRewardsByUserId(conn)
  const findLatestUserReviewRewardByReviewId = async (userId: string, reviewId: string) => {
    const db = await conn.getConnection()
    const operation: REWARD_OPERATION = 'ADD'
    const sql = `SELECT * FROM USERS_REWARDS WHERE operation = '${operation}' AND userId = '${userId}' AND reviewId = '${reviewId}' ORDER BY timestamp DESC LIMIT 1`
    return new _Promise<IReviewReward>((res, rej) => {
      db.get(sql, function (this, err, record) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(record)
        }
      })
    })
  }

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
