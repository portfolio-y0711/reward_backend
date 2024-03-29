import express from 'express'
import createDatabaseConnector from './data/connection'
import swaggerUI from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import { createEventRouter } from './routers/event'
import { Database } from './data'
import createUserRouter from './routers/user'
import path from 'path'
import errorHandler from './middleware/error'
import logger from './middleware/logger'
import { appLogger } from './util/applogger'

export default async () => {
  appLogger.debug("app started")
  const app = express()
  const dbConnector = createDatabaseConnector({
    filename: './dev.db',
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const db = Database(dbConnector)
  await db.init()
  await db.seed()

  const eventRouter = createEventRouter({ db })
  const userRouter = createUserRouter({ db })

  app.use(logger)
  app.get('/healthCheck', (_: express.Request, res: express.Response) =>
    res.json({ status: 'UP' }),
  )

  app.use('/', eventRouter)
  app.use('/', userRouter)

  app.use(express.static(path.join(__dirname, 'static')))
  app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  app.use(errorHandler)
  return app
}
