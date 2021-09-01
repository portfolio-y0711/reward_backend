import { Database, IEventDatabase } from '@app/data'
import DatabaseConnector from '@app/data/connection'

beforeEach(async () => {
  const t0 = Date.now()
  const databaseConnector = DatabaseConnector({
    filename: './feature.db',
  })
  let db: IEventDatabase
  db = Database(databaseConnector)
  await db.init()
  await db.clear()
  await db.close()
  // const connectTime = Date.now()
  // console.log(
  //   ` 👩‍🔬 Connected in ${connectTime - t0}ms - Executed migrations in {migrationTime - connectTime }ms.`
  // )
})

afterAll(async () => {
  const t0 = Date.now()
  const databaseConnector = DatabaseConnector({
    filename: './feature.db',
  })
  // const db = Database(databaseConnector)
  // await db.init()
  // await db.clear()
  // await db.close()

  // const connectTime = Date.now()
  //   console.log(
  //     ` 👩‍🔬 Connected in ${connectTime - t0}ms - Executed migrations in {migrationTime - connectTime }ms.`
  // )
})
