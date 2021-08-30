import { IDatabaseConnector } from '@app/data/connection'
import { CreatePlaceTable } from './ddl/create.table'
import { DropPlaceTable } from './ddl/drop.table'
import _Promise from 'bluebird'
import { FindPlaceByName } from './dml/query/impl/find-place-by-name'
import { Save } from './dml/cmd/impl'
import { ISchemaAdaptor } from '@app/data'

export interface IPlace {
  id?: string
  country: string
  placeId: string
  bonusPoint: number
  name: string
}

export interface IPlaceModel extends ISchemaAdaptor {
  save: (place: IPlace, placeId?: string) => Promise<void>
  remove: () => void
  removeAll: () => Promise<void>
  findBonusPoint: (placeId: string) => Promise<number>
  findPlaceByName: (name: string) => Promise<IPlace>
}

export const PlaceModel = (conn: IDatabaseConnector): IPlaceModel => {
  const dropSchema = DropPlaceTable(conn)
  const createSchema = CreatePlaceTable(conn)
  const save = Save(conn)
  const remove = () => {}
  const removeAll = async () => {
    const db = await conn.getConnection()
    const sql = `DELETE FROM PLACES`
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
  const findPlaceByName = FindPlaceByName(conn)
  const findBonusPoint = async (placeId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT bonusPoint FROM PLACES WHERE placeId = '${placeId}'`
    return new _Promise<number>((res, rej) => {
      db.get(sql, function(err, row) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(row['bonusPoint'])
        }
      })
    })
  }

  return {
    createSchema,
    dropSchema,
    save,
    remove,
    removeAll,
    findBonusPoint,
    findPlaceByName,
  }
}
