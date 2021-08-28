import { IEventController } from '@app/controllers/event'
import { Router } from 'express'

export default (controller: any) => {
  const router = Router()
  router.post('/events', controller.postEvent)
  return router
}
