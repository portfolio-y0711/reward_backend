import { IDatabaseConnector } from "@app/data/connection"
import { CreatePlaceTable } from "./ddl/create.table"
import { DropPlaceTable } from "./ddl/drop.table"
import { ISchemaAdaptor } from '../../adaptor/index'

export interface IPlaceModel extends ISchemaAdaptor {
  save: () => void
  remove: () => void
}

export const PlaceModel = (conn: IDatabaseConnector): IPlaceModel => {
  const dropSchema = DropPlaceTable(conn)
  const createSchema = CreatePlaceTable(conn)
  const save = () =>{}
  const remove = () =>{}

  return {
    createSchema,
    dropSchema,
    save,
    remove
  }
}
