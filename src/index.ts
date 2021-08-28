import express from 'express'
import createUserRouter from './routers/user'
import createUserController from './controllers/user'
import createUserService from './services/users'
import createDatabaseConnector from './data/connection'
import createDatabaseAdaptor from './data/adaptor'

import createEventRouter from './routers/event'
import { Database } from './data'

export default async () => {
  const app = express()
  const dbConnector = createDatabaseConnector({
    filename: './dev.db',
  })

  const dbAdaptor = createDatabaseAdaptor(dbConnector)
  const db = Database(dbConnector)
  await db.init()

  const userService = createUserService(db)
  const userController = createUserController(userService)
  const userRouter = createUserRouter(userController)

  const eventRouter = createEventRouter({ postEvent: () => {}})

  app.use("/api", userRouter)
  app.use("/api", eventRouter)
  return app
}
