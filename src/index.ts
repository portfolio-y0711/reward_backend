import express, { Request, Response } from 'express'
// import createRouter from './routers'
// import createController from './controllers'

export default () => {
  const app = express()
  // const controller = createController()
  // const router = createRouter(controller)
  // app.use(router)
  app.get("/api/events", (req: Request, res: Response) => {
    res.json("test")
  })
  return app
}
