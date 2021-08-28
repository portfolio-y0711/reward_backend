import { Router } from 'express'
import { IUserController } from '@app/controllers/user'

export default (controller: IUserController) => {
  const router = Router()
  router.get('/users', controller.getUsers)
  return router
}
