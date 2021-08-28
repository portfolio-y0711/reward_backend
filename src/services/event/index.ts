import { IEvent } from '@app/typings'

export interface IEventHandlingService {
  handleEvent: (type: IEvent) => void
}
interface IHandler {
  [name: string]: any
}

const EventHandlingService = (handlers: IHandler) => {
  const handleEvent = (event: IEvent) => {
    const { type } = event
    handlers[type](event)
  }
  return {
    handleEvent,
  }
}

export default EventHandlingService
