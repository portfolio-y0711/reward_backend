import EventHandlingService from '@app/services/event'
import { IHandlers } from '@app/services/event/review/handlers'
import { IEvent } from '@app/typings'
import { ReviewEventHandler } from '../../../src/services/event/review/handlers/handler.review-event';
import { Database, IDatabase } from "@app/data"
import DatabaseConnector, { IDatabaseConnector } from "@app/data/connection"

describe('[Event] service => handlers', () => {
  let handlers: IHandlers
  let spy: jest.Mock<any, any>
  let databaseConnector: IDatabaseConnector
  let db: IDatabase
  
  beforeAll(() => {
    spy = jest.fn()
    databaseConnector = DatabaseConnector({
      filename: './i11.db'
    })
    db = Database(databaseConnector)
    db.init()
  })

  describe('when [POST: /api/events => controller.postEvent]', () => {
    it('service.handleEvent <= handlers.handleReviewEvent', () => {
      const reviewEventHandler = ReviewEventHandler(db)
      handlers = {
        "REVIEW": reviewEventHandler
      }
      const eventHandlingService = EventHandlingService(handlers)
      const event: IEvent = {
        "type": "REVIEW",
        "action": "ADD",
        "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
        "content": "좋아요!",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
      }
      // eventHandlingService.handleEvent(event)
      // const userModel = db.getUserModel()
      // const afterEvent =  userModel.findUserReviewPoint(event['userId']) 
      // expect(afterEvent).toEqual()
    })
    
  })
})