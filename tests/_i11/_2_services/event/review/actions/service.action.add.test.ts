import { Database, IEventDatabase } from '@app/data'
import {
  IReviewPointEvent,
  ReviewEventActionRouter,
  REVIEW_ACTION,
} from '@app/services/event/review/actions'
import DatabaseConnector from '@app/data/connection'
import { IDatabaseConnector } from '@app/data/connection'
import EventRouter, { IEventRouteService } from '@app/services/event'
import { IEvent, EVENT_TYPE } from '@app/typings'
import { IUser } from '@app/data/models/user'
import { IPlace } from '@app/data/models/place'
import { PlaceSeeder, UserSeeder } from '@tests/helpers'
import { BlarBlarEventActionRouter } from '@app/services/event/review/actions/blar_blar'

describe('[Event: REVIEW, ADD] service => model', () => {
  let conn: IDatabaseConnector
  let db: IEventDatabase
  let service: IEventRouteService

  let userSeeder: (user: IUser) => Promise<void>
  let placeSeeder: (place: IPlace) => Promise<void>

  beforeAll(async () => {
    conn = DatabaseConnector({
      filename: 'i11.db',
    })
    db = Database(conn)
    await db.init()
    await db.clear()

    service = EventRouter({
      REVIEW: ReviewEventActionRouter(db).route,
      BLAR_BLAR: BlarBlarEventActionRouter(db).route,
    })

    userSeeder = UserSeeder(db)
    placeSeeder = PlaceSeeder(db)
  })

  afterEach(async () => {
    await db.clear()
  })

  describe('when [POST: /api/events => controller.postEvent => service.handleEvent => handlers.handleReviewEvent]', () => {
    it(['service.handleEvent =>'].join('\n'), async () => {
      const type: EVENT_TYPE = 'REVIEW'
      const action: REVIEW_ACTION = 'ADD'
      const event: IReviewPointEvent & IEvent = {
        type,
        action,
        reviewId: '240a0658-dc5f-4878-9381-ebb7b2667772',
        content: '좋아요!',
        attachedPhotoIds: [
          'e4d1a64e-a531-46de-88d0-ff0ed70c0bb8',
          'afb0cef2-851d-4a50-bb07-9cc15cbdc332',
        ],
        userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
        placeId: '2e4baf1c-5acb-4efb-a1af-eddada31b00f',
      }
      await userSeeder({
        userId: event['userId'],
        name: 'Michael',
        rewardPoint: 0,
      })

      await placeSeeder({
        placeId: event['placeId'],
        bonusPoint: 1,
        country: '호주',
        name: '시드니',
      })

      await service.routeEvent(event)

      const userModel = db.getUserModel()
      const result = await userModel.findUserRewardPoint(event['userId'])
      expect(result).toEqual(3)
    })
  })
})
