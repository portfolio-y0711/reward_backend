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
import {BlarBlarEventActionRouter  } from '@app/services/event/review/actions/blar_blar'
import { IUser } from '@app/data/models/user'
import { IPlace } from '@app/data/models/place'
import { PlaceSeeder, ReviewSeeder, RewardSeeder, UserSeeder } from '@tests/helpers'
import { BooleanCode, IReview } from '@app/data/models/review'
import { IRewardRecord } from '@app/data/models/reward'
import { uuidv4 } from '@app/util'

describe('[Event: REVIEW, MOD] service => model', () => {
  let conn: IDatabaseConnector
  let db: IEventDatabase
  let service: IEventRouteService

  let userSeeder: (user: IUser) => Promise<void>
  let placeSeeder: (place: IPlace) => Promise<void>
  let reviewSeeder: (review: IReview) => Promise<void>
  let rewardSeeder: (reviewReward: IRewardRecord) => Promise<void>

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
    reviewSeeder = ReviewSeeder(db)
    rewardSeeder = RewardSeeder(db)
  })

  afterEach(async () => {
    await db.clear()
  })

  describe('when [POST: /api/events => controller.postEvent => service.handleEvent => handlers.handleReviewEvent]', () => {
    it(['service.handleEvent =>'].join('\n'), async () => {
      const type: EVENT_TYPE = 'REVIEW'
      const action: REVIEW_ACTION = 'MOD'
      const userId = '3ede0ef2-92b7-4817-a5f3-0c575361f745'
      const reviewId = '240a0658-dc5f-4878-9381-ebb7b2667772'
      const placeId = '2e4baf1c-5acb-4efb-a1af-eddada31b00f'

      const event: IReviewPointEvent & IEvent = {
        type,
        action,
        reviewId,
        content: '좋긴 한데요..!!',
        attachedPhotoIds: [],
        userId,
        placeId,
      }

      await userSeeder({
        userId,
        name: 'Michael',
        rewardPoint: 3,
      })

      await placeSeeder({
        placeId,
        bonusPoint: 1,
        country: '호주',
        name: '시드니',
      })

      await reviewSeeder({
        reviewId,
        placeId,
        content: '좋아요',
        attachedPhotoIds: [
          'e4d1a64e-a531-46de-88d0-ff0ed70c0bb8',
          'afb0cef2-851d-4a50-bb07-9cc15cbdc332',
        ],
        userId,
        rewarded: BooleanCode.True,
      })

      await rewardSeeder({
        rewardId: uuidv4(),
        reviewId,
        operation: 'ADD',
        pointDelta: 3,
        reason: 'NEW',
        userId,
      })

      await new Promise((res) => setTimeout(res, 1000))

      const reviewModel = db.getReviewModel()
      await reviewModel.updateRewardedReview({
        content: event.content,
        attachedPhotoIds: event.attachedPhotoIds,
        placeId,
        reviewId,
        rewarded: BooleanCode.True,
        userId,
      })

      await service.routeEvent(event)

      const userModel = db.getUserModel()
      const result = await userModel.findUserRewardPoint(userId)
      expect(result).toEqual(2)
    })
  })
})
