import { Database, IDatabase } from "@app/data"
import DatabaseConnector, { IDatabaseConnector } from "@app/data/connection"

describe('', () => {
  let databaseConnector: IDatabaseConnector
  let db: IDatabase

  beforeAll(() => {
    databaseConnector = DatabaseConnector({
      filename: './i11.db'
    })
    db = Database(databaseConnector)
    db.init()
  })

  it('', async() => {
    const model = db.getUserModel() 
    const users = await model.findUsers()
  })
})