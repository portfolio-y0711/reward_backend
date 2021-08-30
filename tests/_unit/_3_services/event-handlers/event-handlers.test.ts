import EventRouter, { IEventHandler, IEventHandlers } from '@app/services/event-handlers'
import { IEvent } from '@app/typings'
import { mock } from 'jest-mock-extended';

describe('[Event] service => handlers', () => {
  let fakeHandlers: IEventHandlers
  let spy: jest.Mock<any, any>

  
  beforeAll(() => {
    spy = jest.fn()
  })

  describe('when [POST: /api/events => controller.postEvent]', () => {
    it('service.handleEvent => handlers.handleReviewEvent', () => {
      fakeHandlers = {
        "REVIEW": spy,
        "BLAR_BLAR": mock<IEventHandler>()
      }
      const eventHandlingService = EventRouter(fakeHandlers)
      const event: IEvent = {
        "type": "REVIEW",
        "action": "ADD",
        "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
        "content": "좋아요!",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
      }
      eventHandlingService.handleEvent(event)
      expect(spy).toBeCalledTimes(1)
      expect(spy).toBeCalledWith(event)
    })
    
  })
})