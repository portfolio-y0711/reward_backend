import { IDatabaseConnector } from '@app/data/connection'
import { CreateUserTable } from './ddl/create.table'
import { DropUserTable } from './ddl/drop.table'
import _Promise from 'bluebird'
import { uuidv4 } from '@app/util'
import { ISchemaAdaptor } from '@app/data'
import { CreateUserTableIndex } from './ddl/create-index.table'

export interface IUserModel extends ISchemaAdaptor {
  save: (user: IUser, userId?: string) => Promise<void>
  remove: () => Promise<void>
  removeAll: () => Promise<void>
  createIndex: () => Promise<void>
  findUsers: () => Promise<IUser[]>
  updateReviewPoint: (userId: string, points: number) => Promise<number>
  findUserById: (userId: string) => Promise<IUser>
  findUserRewardPoint: (userId: string) => Promise<number>
}

export interface IUser {
  id?: string
  userId: string
  name: string
  rewardPoint: number
}

export const UserModel = (conn: IDatabaseConnector): IUserModel => {
  const dropSchema = DropUserTable(conn)
  const createSchema = CreateUserTable(conn)
  const createIndex = CreateUserTableIndex(conn)
  const findUsers = async () => {
    const db = await conn.getConnection()
    const sql = `SELECT * FROM USERS`
    return new _Promise<IUser[]>((res, rej) => {
      db.all(sql, function (err, result) {
        res(result)
        if (err) {
          console.log('error running sql ' + sql)
        }
      })
    })
  }
  const save = async (user: IUser, id?: string) => {
    const db = await conn.getConnection()
    const { userId, name, rewardPoint } = user
    const sql = `INSERT INTO USERS(userId,name,rewardPoint) VALUES('${
      userId ?? uuidv4()
    }', '${name}', '${rewardPoint}')`
    // const sql = `INSERT INTO USERS VALUES('${userId ?? uuidv4()}', '${name}', 'null')`
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
    const sql = `delete from USERS`
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
  const findUserById = async (userId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT * FROM USERS WHERE userId = '${userId}'`
    return new _Promise<IUser>((res, rej) => {
      db.get(sql, function (this, err, row) {
        if (err) {
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(row)
        }
      })
    })
  }
  const findUserRewardPoint = async (userId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT rewardPoint FROM USERS WHERE userId = '${userId}'`
    return new _Promise<number>((res, rej) => {
      db.get(sql, function (this, err, row) {
        if (err) {
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(row.rewardPoint)
        }
      })
    })
  }
  const updateReviewPoint = async (userId: string, points: number) => {
    const db = await conn.getConnection()
    const sql = `UPDATE USERS SET rewardPoint = '${points}' WHERE userID = '${userId}'`
    return await new _Promise<number>((res, rej) => {
      db.run(sql, function (this, err) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(points)
        }
      })
    })
  }

  return {
    updateReviewPoint: updateReviewPoint,
    findUserById,
    createSchema,
    dropSchema,
    createIndex,
    save,
    remove,
    removeAll,
    findUsers,
    findUserRewardPoint,
  }
}
