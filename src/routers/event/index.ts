import { IEventController } from '@app/controllers/event'
import express, { Router } from 'express'

export default (controller: IEventController) => {
  const router = Router()
  router.post('/events', controller.postEvent)
  return router
}
