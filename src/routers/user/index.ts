import { IUserController } from '@app/controllers/user'
import { Router } from 'express'

export default (controller: IUserController) => {
  const router = Router()
  router.get('/users/:userId/points', controller.getUserReviewPoint)
  return router
}
