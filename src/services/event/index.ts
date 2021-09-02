import { IEvent, EVENT_TYPE } from '@app/typings'

export interface IEventRouteService {
  handleEvent: (type: IEvent) => Promise<void>
}

export interface IEventRoute {
  (event: any): Promise<void>
}

export type IEventRoutes = {
  [Key in EVENT_TYPE]: IEventRoute
}

const EventRouter = (routes: IEventRoutes) => {
  const routeEvent = async (event: IEvent) => {
    const { type } = event
    await routes[type](event)
  }
  return {
    routeEvent,
  }
}

export default EventRouter
