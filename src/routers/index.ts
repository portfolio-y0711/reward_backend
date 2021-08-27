import { Request, Response } from 'express'
import { Router } from 'express'
// import { IUserController } from '../controllers'

// export default (controller: IUserController) => {
export default () => {
  const router = Router()
  // router.put("/api/users/:uuid/points", controller.putUserPoints)
  // router.get("/api/users/:uuid/points", controller.putUserPoints)
  // router.post("/api/places/:uuid/review", controller.postPlaceReview)
  router.get("/api/events", (req: Request, res: Response) => {
    res.json("test")
  })
  return router
}