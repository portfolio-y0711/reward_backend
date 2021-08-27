
export interface IEventHandlingService {
  test: () => Promise<void>
}

const EventHandlingService = (): IEventHandlingService => {
  return {
    test: async() => {
      return 
    }
  }
}

export default EventHandlingService