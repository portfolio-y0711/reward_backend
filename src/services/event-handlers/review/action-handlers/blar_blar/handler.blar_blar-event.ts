import { IEventDatabase } from '@app/data'
import { IEvent } from '@app/typings'

export type BLAR_BLAR_ACTION = "A" | "B" | "C"

export interface IBlarBlarEvent extends IEvent {
  action: BLAR_BLAR_ACTION
}

export interface IBlarBlarEventActionHandler {
  (eventInfo: IBlarBlarEvent): Promise<void>
}

export const BlarBlarEventHandler = (db: IEventDatabase) => {
  return async (eventInfo: IBlarBlarEvent) => {
    const actions: { [Key in BLAR_BLAR_ACTION]: IBlarBlarEventActionHandler } = {
      "A": async(eventInfo: IBlarBlarEvent) => {},
      "B": async(eventInfo: IBlarBlarEvent) => {},
      "C": async(eventInfo: IBlarBlarEvent) => {},
    }
    actions[eventInfo.action](eventInfo)
  }
}
