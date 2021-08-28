export interface IEventHandlingServices {
    handleEvent: (type: IEvent) => void
}


export interface IEvent {
  type: string
}

interface IReviewPointEvent {
  action: string,
  reviewId: string,
  content: string,
  attachedPhotoIds: string[],
  userId: string,
  placeId: string
}

const EventHandlingServices = (): IEventHandlingServices => {
  const actions: { [name: string]: any } = {
    "ADD": () => {},
    "MOD": () => {},
    "DELETE": () => {}
  }
  const reviewPointService = (eventInfo: IReviewPointEvent) => {
    let isPointRewardable = false
    // const isPointRewardable = checkPointsAvailable(placeId)
    if (isPointRewardable) {
      const { content, attachedPhotoIds } = eventInfo
      const points = (content.length > 1 ? 1 : 0) + (attachedPhotoIds.length > 1 ? 1 : 0)
    }
  }

  const services: { [name: string]: any } = {
    'REVIEW': reviewPointService
  }
  const handleEvent = (event: IEvent) => {
    const { type } = event
    services[type](event)
  }
  return {
    handleEvent
  }
}

export default EventHandlingServices
