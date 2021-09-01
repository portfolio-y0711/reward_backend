import { IDatabaseConnector } from '@app/data/connection'
import { CreateUserTable } from './ddl/create.table'
import { DropUserTable } from './ddl/drop.table'
import _Promise from 'bluebird'
import { ISchemaAdaptor } from '@app/data'
import { CreateUserTableIndex } from './ddl/create-index.table'
import { FindUsers } from './dml/find-users'
import { Save } from './dml/save'
import { FindUserById } from './dml/find-user-by-id'
import { RemoveAll } from './dml/remove-all'
import { FindUserRewardPoint } from './dml/find-user-reward-point'
import { UpdateReviewPoint } from './dml/update-review-point'

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
  const findUsers = FindUsers(conn)
  const findUserById = FindUserById(conn)
  const save = Save(conn)
  const remove = async () => {}
  const removeAll = RemoveAll(conn)
  const findUserRewardPoint = FindUserRewardPoint(conn)
  const updateReviewPoint = UpdateReviewPoint(conn)
  return {
    updateReviewPoint,
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
