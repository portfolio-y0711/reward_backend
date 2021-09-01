import { IEventDatabase } from "@app/data"
import UserController from '@app/controllers/user'
import UserService from '@app/services/user'
import EventRouter from './routes'
import { Router } from 'express'

export const createUserRouter
  = (context: { db: IEventDatabase }) => {
    const { db } = context
    const service = UserService(db)
    const controller = UserController(service)
    const router = Router()
    router.use(EventRouter(controller))
    return router
  }

export default createUserRouter