import { PostEvent } from '@app/controllers/event/impl/controller.post-event'
import { IEventHandlingService } from '@app/services/event'
import { IHttpRequest } from '@app/typings'
import { mock, MockProxy } from 'jest-mock-extended'

describe('[Event] controller => service', () => {
  let mockEventHandlingService: MockProxy<IEventHandlingService>

  beforeAll(() => {
    mockEventHandlingService = mock<IEventHandlingService>()
  })

  describe('when [POST: /events =>]', () => {
    it('controller.postEvent => service.getHandlingService', async () => {
      const postEvent = PostEvent(mockEventHandlingService)
      const httpRequest: IHttpRequest = {
        body: {
          type: 'REVIEW',
          action: 'ADD',
          reviewId: '240a0658-dc5f-4878-9381-ebb7b2667772',
          content: '좋아요!',
          attachedPhotoIds: [
            'e4d1a64e-a531-46de-88d0-ff0ed70c0bb8',
            'afb0cef2-851d-4a50-bb07-9cc15cbdc332',
          ],
          userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
          placeId: '2e4baf1c-5acb-4efb-a1af-eddada31b00f',
        },
        params: {},
        query: {},
      }
      await postEvent(httpRequest)
      expect(mockEventHandlingService.handleEvent).toBeCalledTimes(1)
      expect(mockEventHandlingService.handleEvent).toBeCalledWith(httpRequest.body)
    })
  })
})
