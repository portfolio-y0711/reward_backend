import { IDatabaseConnector } from "../connection"

export interface ICrudAdaptor {
  save: () => void
  remove: () => void
}

export interface ISchemaAdaptor {
  dropSchema: () => Promise<any>
  createSchema: () => Promise<any>
}


function DatabaseAdaptor (conn: IDatabaseConnector): ICrudAdaptor {
  const save = () => {
  }
  const remove = () => {
  }
  return {
    save,
    remove,
  }
}

export default DatabaseAdaptor