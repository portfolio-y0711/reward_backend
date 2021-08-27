import { IDatabaseConnector } from '@app/data/connection'
import { CreatePlaceTable } from './ddl/create.table'
import { DropPlaceTable } from './ddl/drop.table'
import { ISchemaAdaptor } from '../../adaptor/index'
import { uuidv4 } from '@app/util'

export interface IPlace {
  placeId?: string
  uuid: string
  name: string
}

export interface IPlaceModel extends ISchemaAdaptor {
  save: (place: IPlace, placeId?: string) => Promise<void>
  remove: () => void
}

export const PlaceModel = (conn: IDatabaseConnector): IPlaceModel => {
  const dropSchema = DropPlaceTable(conn)
  const createSchema = CreatePlaceTable(conn)
  const save = async (place: IPlace, placeId?: string) => {
    const db = conn.getConnection()
    const { uuid, name } = place

    const sql = `INSERT INTO PLACES VALUES('${placeId ?? uuidv4()}','${uuid}','${name}')`
    db.run(sql, function (err) {
      if (err) {
        console.log('error running sql ' + sql)
      }
    })
  }
  const remove = () => {}

  return {
    createSchema,
    dropSchema,
    save,
    remove,
  }
}
