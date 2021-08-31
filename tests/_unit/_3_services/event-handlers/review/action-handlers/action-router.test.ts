import { IEventDatabase } from '@app/data'
import { ComposeActionHandlerRoutes } from '@app/services/event/review/actions'
import { IReviewEventActionHandler } from '@app/services/event/review/actions'
import { REVIEW_ACTION } from '@app/services/event/review/actions'
import { IReviewEventActionHandlers } from '@app/services/event/review/actions'
import { IReviewPointEvent } from '@app/services/event/review/actions'
import { mock, MockProxy } from 'jest-mock-extended'

describe('[Event] service => handlers', () => {
  let fakeComposeActionHandlers: (db: IEventDatabase) => IReviewEventActionHandlers
  let spy: jest.Mock<any, any>
  let db: MockProxy<IEventDatabase>
  let eventInfoExceptAction: {
    type: IReviewPointEvent["type"]
    reviewId: IReviewPointEvent["reviewId"]
    content: IReviewPointEvent["content"],
    attachedPhotoIds: IReviewPointEvent["attachedPhotoIds"],
    userId: IReviewPointEvent["userId"],
    placeId: IReviewPointEvent["placeId"],
  }

  beforeAll(() => {
    spy = jest.fn()
    db = mock<IEventDatabase>()
    eventInfoExceptAction = {
      "type": "REVIEW",
      "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
      "content": "좋아요!",
      "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
      "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
      "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when [POST: /api/events => controller.postEvent]', () => {
    it('service.handleEvent => handlers.handleReviewEvent', async () => {
      const action: REVIEW_ACTION = "ADD"
      fakeComposeActionHandlers = (_: IEventDatabase) => {
        return {
          "ADD": spy,
          "MOD": mock<IReviewEventActionHandler>(),
          "DELETE": mock<IReviewEventActionHandler>()
        }
      }
      const event = { ...eventInfoExceptAction, action }
      await ComposeActionHandlerRoutes(fakeComposeActionHandlers)(db).route(event)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(event)
    })

    it('service.handleEvent => handlers.handleReviewEvent', async () => {
      const action: REVIEW_ACTION = "MOD"
      fakeComposeActionHandlers = (_: IEventDatabase) => {
        return {
          "ADD": mock<IReviewEventActionHandler>(),
          "MOD": spy,
          "DELETE": mock<IReviewEventActionHandler>()
        }
      }
      const event = { ...eventInfoExceptAction, action }
      await ComposeActionHandlerRoutes(fakeComposeActionHandlers)(db).route(event)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(event)
    })

    it('service.handleEvent => handlers.handleReviewEvent', async () => {
      const action: REVIEW_ACTION = "DELETE"
      fakeComposeActionHandlers = (_: IEventDatabase) => {
        return {
          "ADD": mock<IReviewEventActionHandler>(),
          "MOD": mock<IReviewEventActionHandler>(),
          "DELETE": spy
        }
      }
      const event = { ...eventInfoExceptAction, action }
      await ComposeActionHandlerRoutes(fakeComposeActionHandlers)(db).route(event)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(event)
    })
  })
})