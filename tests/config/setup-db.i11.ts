import { Database } from "@app/data"
import DatabaseConnector from "@app/data/connection"


beforeAll(async() => {
  const t0 = Date.now()
  const databaseConnector = DatabaseConnector({
    filename: './i11.db'
  })
  const db = Database(databaseConnector)
  // await db.init()

  await db.close() 
  const connectTime = Date.now()
    console.log(
      ` 👩‍🔬 Connected in ${connectTime - t0}ms - Executed migrations in {migrationTime - connectTime }ms.`
  )
})

