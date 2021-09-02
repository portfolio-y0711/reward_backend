import { IEventDatabase } from "@app/data"
import { IBlarBlarEventActionRoutes } from "./index"
import { A_ActionHandler } from './impl/action.handler.a'
import { B_ActionHandler } from './impl/action.handler.b'
import { C_ActionHandler } from './impl/action.handler.c'

export const blarblarEventActionRoutes = (db: IEventDatabase): IBlarBlarEventActionRoutes => {
  return {
    "A": A_ActionHandler(db),
    "B": B_ActionHandler(db),
    "C": C_ActionHandler(db)
  }
}
