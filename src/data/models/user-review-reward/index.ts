import { IDatabaseConnector } from '@app/data/connection'
import { CreateUserRewardTable } from './ddl/create.table'
import { DropUserRewardTable } from './ddl/drop.table'
import _Promise from 'bluebird'
import { uuidv4 } from '@app/util'
import { ISchemaAdaptor } from '@app/data'
import { CreateUserRewardTableIndex } from './ddl/create-index.table'

export interface IUserRewardModel extends ISchemaAdaptor {
  save: (user: IUserReward, userId?: string) => Promise<void>
  remove: () => Promise<void>
  removeAll: () => Promise<void>
  createIndex: () => Promise<void>
  createSchema: () => Promise<void>
  findUserRewardsByUserId: (userId: string) => Promise<IUserReward[]>
}

export type REWARD_OPERATION = 'ADD' | 'SUB'

export type REWARD_REASON = 'NEW' | 'MOD' | 'DEL' | 'RED'

export interface IUserReward {
  id?: string
  rewardId: string
  userId: string
  reviewId: string
  operation: REWARD_OPERATION
  pointDelta: number
  reason: REWARD_REASON
}

export const UserRewardModel = (conn: IDatabaseConnector): IUserRewardModel => {
  const dropSchema = DropUserRewardTable(conn)
  const createSchema = CreateUserRewardTable(conn)
  const createIndex = CreateUserRewardTableIndex(conn)

  const save = async (userReward: IUserReward, id?: string) => {
    const db = await conn.getConnection()
    const { rewardId, userId, reviewId, operation, pointDelta, reason } = userReward
    const sql = `INSERT INTO USERS_REWARDS(rewardId,userId,reviewId,operation,pointDelta,reason) VALUES('${rewardId ?? uuidv4()}', '${userId}', '${reviewId}', '${operation}', '${pointDelta}', '${reason}')`

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

  const remove = async () => { }

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
  const findUserRewardsByUserId = async (userId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT * FROM USERS_REWARDS WHERE userId = '${userId}'`
    return new _Promise<IUserReward[]>((res, rej) => {
      db.all(sql, function (this, err, records) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(records)
        }
      })
    })
  }

  return {
    createSchema,
    dropSchema,
    createIndex,
    save,
    findUserRewardsByUserId,
    remove,
    removeAll
  }
}
