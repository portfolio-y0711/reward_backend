import { IEvent, EVENT_TYPE } from '@app/typings'
import { appLogger } from '@app/util/applogger'

export interface IEventRouteService {
  routeEvent: (type: IEvent) => Promise<void>
}

export interface IEventRoute {
  (event: any): Promise<void>
}

export type IEventRoutes = {
  [Key in EVENT_TYPE]: IEventRoute
}

const EventRouter = (routes: IEventRoutes): IEventRouteService => {
  const routeEvent = async (event: IEvent) => {
    appLogger.info(`[EVENT: EventRouter] received '${event.type}' |type| event => relay event to '${event.type}' event |action| router\n`)
    const { type } = event
    await routes[type](event)
  }
  return {
    routeEvent,
  }
}

export default EventRouter
