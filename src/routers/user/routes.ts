import { IUserController } from '@app/controllers/user'
import { Router } from 'express'

export default (controller: IUserController) => {
  const router = Router()
  router.get('/users/:userId/rewardPoint', controller.getUserReviewPoint)
  router.get('/users/:userId/rewards', controller.getUserRewards)
  return router
}
