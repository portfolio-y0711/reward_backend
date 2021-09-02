import { IEventDatabase } from '@app/data'
import { IEvent } from '@app/typings'
import { blarblarEventActionRoutes } from './routes'

export type BLAR_BLAR_ACTION = 'A' | 'B' | 'C'

export interface IBlarBlarEvent extends IEvent {
  action: BLAR_BLAR_ACTION
}

export interface IBlarBlarEventActionRoute {
  (eventInfo: IBlarBlarEvent): Promise<void>
}

export type IBlarBlarEventActionRoutes = {
  [Key in BLAR_BLAR_ACTION]: IBlarBlarEventActionRoute
}

export const ComposeActionRoutes = (
  createActionRoutes: (db: IEventDatabase) => IBlarBlarEventActionRoutes
) => {
  return (db: IEventDatabase) => {
    const actionRoutes = createActionRoutes(db)
    const route = async(eventInfo: IBlarBlarEvent) => {
      await actionRoutes[eventInfo.action](eventInfo)
    }
    return {
      route
    }
  }
}

export const BlarBlarEventActionRouter = ComposeActionRoutes(blarblarEventActionRoutes)
