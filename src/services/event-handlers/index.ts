import { IEvent, EVENT_TYPE } from '@app/typings'

export interface IEventHandlingService {
  handleEvent: (type: IEvent) => Promise<void>
}

export interface IEventHandler {
  (event: any): Promise<void>
}

export type IEventHandlers = {
  [Key in EVENT_TYPE]: IEventHandler
}

const EventRouter = (handlers: IEventHandlers) => {
  const handleEvent = async (event: IEvent) => {
    const { type } = event
    await handlers[type](event)
  }
  return {
    handleEvent,
  }
}

export default EventRouter
