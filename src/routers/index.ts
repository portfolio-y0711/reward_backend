import { Router } from 'express'
import { IUserController } from 'src/controllers'
// import { IUserController } from '../controllers'

export default (controller: IUserController) => {
  const router = Router()
  // router.put("/api/users/:uuid/points", controller.putUserPoints)
  // router.get("/api/users/:uuid/points", controller.putUserPoints)
  // router.post("/api/places/:uuid/review", controller.postPlaceReview)
  router.get('/api/events', controller.test)
  return router
}
