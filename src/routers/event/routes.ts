import { IEventController } from '@app/controllers/event'
import { Router } from 'express'
import EventScheme from '@app/typings/request/event'
import { validateDto } from '@app/middleware/validator'

export default (controller: IEventController) => {
  const router = Router()
  router.post('/events', validateDto(EventScheme), controller.postEvent)
  return router
}
