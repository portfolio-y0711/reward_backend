import express from 'express'
import createUserRouter from './routers/user'
import createUserController from './controllers/user'
import createUserService from './services/users'
import createDatabaseConnector from './data/connection'

import createEventRouter from './routers/event'
import createEventController from './controllers/event'
import { Database } from './data'
import { IEvent } from './typings'

export default async () => {
  const app = express()
  const dbConnector = createDatabaseConnector({
    filename: './dev.db',
  })

  const db = Database(dbConnector)
  await db.init()

  const userService = createUserService(db)
  const userController = createUserController(userService)
  const userRouter = createUserRouter(userController)

  const eventController = createEventController({ handleEvent: (type: IEvent) => 'service' })
  const eventRouter = createEventRouter({ postEvent: () => {} })

  app.use('/api', userRouter)
  app.use('/api', eventRouter)
  return app
}
