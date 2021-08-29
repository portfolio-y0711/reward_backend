import { Database, IEventDatabase } from "@app/data"
import DatabaseConnector from "@app/data/connection"

let db: IEventDatabase

// beforeEach(async() => {
//   const t0 = Date.now()
//   const databaseConnector = DatabaseConnector({
//     filename: './i11.db'
//   })
//   db = Database(databaseConnector)
//   await db.init()
//   // await db.clear()
//   // await db.seed()

//   // await db.close() 
//   const connectTime = Date.now()
//     console.log(
//       ` 👩‍🔬 Connected in ${connectTime - t0}ms - Executed migrations in {migrationTime - connectTime }ms.`
//   )
// })

// afterEach(async() => {
//   await db.close()
// })

// afterAll(async() => {
//   // await db.close()
// })