import { IDatabaseConnector } from '@app/data/connection'
import { CreateUserTable } from './ddl/create.table'
import { DropUserTable } from './ddl/drop.table'
import { ISchemaAdaptor } from '../../adaptor/index'
import _Promise from 'bluebird'

export interface IUserModel extends ISchemaAdaptor {
  save: (user: IUser) => Promise<void>
  remove: () => Promise<void>
} 

export interface IUser {
  uuid: string
  name: string
}

export const UserModel = (conn: IDatabaseConnector): IUserModel => {
  const dropSchema = DropUserTable(conn)
  const createSchema = CreateUserTable(conn)
  const save = async(user: IUser) => {
    const db = conn.getConnection()
    const { uuid, name } = user
    const sql = `INSERT INTO USERS VALUES(null,'${uuid}','${name}')`
    db.run(sql, function(err) {
      if (err) {
        console.log('error running sql ' + sql)
      }
    })
  }
  const remove = async() =>{}

  return {
    createSchema,
    dropSchema,
    save,
    remove
  }
}