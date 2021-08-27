import express from 'express'
import createRouter from './routers'
// import createController from './controllers'

export default () => {
  const app = express()
  // const controller = createController()
  const router = createRouter()
  app.use(router)
  return app
}
