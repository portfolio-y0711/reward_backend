import express from 'express'
import createRouter from './routers'
import createController from './controllers'
import createService from './services'
import createDatabaseConnector from './data/connection'
import createDatabaseAdaptor from './data/adaptor'
import { Database } from './data'

export default async () => {
  const app = express()
  const dbConnector = createDatabaseConnector({
    filename: './dev.db',
  })

  const dbAdaptor = createDatabaseAdaptor(dbConnector)
  const db = Database(dbConnector)
  await db.init()
  const placeModel = db.getPlaceModel()

  const service = createService()
  const controller = createController(service)
  const router = createRouter(controller)

  app.use(router)
  return app
}
