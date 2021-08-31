import { IEventDatabase } from "@app/data"
import EventController from '@app/controllers/event'
import EventService from '@app/services/event'
import EventRouter from './index'
import { EventHandlerRoutes } from "@app/services/event/routes"
import { Router } from 'express'

export const createEventRouter
  = (context: { db: IEventDatabase }) => {
    const { db } = context
    const routes = EventHandlerRoutes({ db })
    const service = EventService(routes)
    const controller = EventController(service)
    const router = Router()
    router.use(EventRouter(controller))
    return router
  }