import { IDatabaseConnector } from '@app/data/connection'
import { CreatePlaceTable } from './ddl/create.table'
import { DropPlaceTable } from './ddl/drop.table'
import _Promise from 'bluebird'
import { FindPlaceByName } from './dml/query/impl/find-place-by-name'
import { Save } from './dml/cmd/impl'
import { ISchemaAdaptor } from '@app/data'
import { RemoveAll } from './dml/query/impl/remove-all'
import { FindBonusPoint } from './dml/query/impl/find-bonus-point'

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
  const findPlaceByName = FindPlaceByName(conn)
  const removeAll = RemoveAll(conn)
  const findBonusPoint = FindBonusPoint(conn)

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
