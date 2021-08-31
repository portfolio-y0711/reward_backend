import express from 'express'
import createDatabaseConnector from './data/connection'
import swaggerUI from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import { createEventRouter } from  './routers/event/routes'
import { Database } from './data'

export default async () => {
  const app = express()
  const dbConnector = createDatabaseConnector({
    filename: './dev.db',
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const db = Database(dbConnector)
  await db.init()
  await db.seed()

  const router = createEventRouter({ db })
  router.get('/healthCheck', (req: express.Request, res: express.Response ) => {
    res.json({
      status: 'UP'
    })
  })
  app.use('/', router)

  app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  return app
}

