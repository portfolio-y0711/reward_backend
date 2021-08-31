import { Database, IEventDatabase } from '@app/data'
import { IReviewPointEvent, ReviewEventActionRouter, REVIEW_ACTION } from '@app/services/event-handlers/review/action-handlers/handler.review-event'
import DatabaseConnector from '@app/data/connection'
import { IDatabaseConnector } from '@app/data/connection'
import EventRouter, { IEventHandlingService } from '@app/services/event-handlers'
import { IEvent, EVENT_TYPE } from '@app/typings'
import { BlarBlarEventHandler } from '@app/services/event-handlers/review/action-handlers/blar_blar/handler.blar_blar-event'
import { IUser } from '@app/data/models/user'
import { IPlace } from '@app/data/models/place'
import { PlaceSeeder, ReviewSeeder, RewardSeeder, UserSeeder } from '@tests/helpers'
import { BooleanCode, IReview } from '@app/data/models/review'
import { IReviewReward } from '@app/data/models/user-review-reward';
import { uuidv4 } from '@app/util'

describe('[Event: REVIEW, MOD] service => model', () => {
  let conn: IDatabaseConnector
  let db: IEventDatabase
  let service: IEventHandlingService

  let userSeeder: (user: IUser) => Promise<void>
  let placeSeeder: (place: IPlace) => Promise<void>
  let reviewSeeder:  (review: IReview) => Promise<void>
  let rewardSeeder:  (reviewReward: IReviewReward) => Promise<void>

  beforeAll(async() => {
    conn = DatabaseConnector({
      filename: 'i11.db'
    })
    db = Database(conn)
    await db.init()
    await db.clear()

    service = EventRouter({
      "REVIEW": ReviewEventActionRouter(db).route,
      "BLAR_BLAR": BlarBlarEventHandler(db)
    })

    userSeeder = UserSeeder(db)
    placeSeeder = PlaceSeeder(db)
    reviewSeeder = ReviewSeeder(db)
    rewardSeeder = RewardSeeder(db)
  })

  afterEach(async() => {
    await db.clear()
  })

  describe('when [POST: /api/events => controller.postEvent => service.handleEvent => handlers.handleReviewEvent]', () => {
    it([
        'service.handleEvent =>',
      ].join('\n'), async() => {

      const type: EVENT_TYPE = "REVIEW"
      const action: REVIEW_ACTION = "MOD"
      const userId = "3ede0ef2-92b7-4817-a5f3-0c575361f745"
      const reviewId = "240a0658-dc5f-4878-9381-ebb7b2667772"
      const placeId = "2e4baf1c-5acb-4efb-a1af-eddada31b00f"

      const event: IReviewPointEvent & IEvent = {
        type,
        action,
        reviewId,
        "content": "좋긴 한데요..",
        "attachedPhotoIds": [],
        userId,
        placeId
      }

      await userSeeder({
        userId,
        name: "Michael",
        rewardPoint: 3
      })

      await placeSeeder({
        placeId,
        bonusPoint: 1,
        country: "호주",
        name: "시드니"
      })

      await reviewSeeder({
        reviewId,
        placeId,
        "content": "좋아요",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        userId,
        "rewarded": BooleanCode.True
      })

      await rewardSeeder({
        rewardId: uuidv4(),
        reviewId,
        operation: "ADD",
        pointDelta: 3,
        reason: "NEW",
        userId
      })

      await new Promise(res => setTimeout(res, 1000))

      const reviewModel = db.getReviewModel()
      await reviewModel.updateRewardedReview({
        content: event.content,
        attachedPhotoIds: event.attachedPhotoIds,
        placeId,
        reviewId,
        rewarded: BooleanCode.True,
        userId
      })

      const isRewarded = await reviewModel.findReviewAndCheckRewarded(userId)

      if (isRewarded) {
        const placeModel = db.getPlaceModel() 
        const bonusPoint = await placeModel.findBonusPoint(placeId)

        const totalPoint
          = (event["content"].length > 1 ? 1 : 0) +
          (event["attachedPhotoIds"].length > 1 ? 1 : 0) +
          bonusPoint
    
        const reviewRewardModel = db.getReviewRewardModel()
        const latestRewardRecord = await reviewRewardModel.findLatestUserReviewRewardByReviewId(userId, reviewId)

        const diff = (totalPoint - latestRewardRecord.pointDelta) 

        if (diff != 0) {
          await reviewRewardModel.save({
            rewardId: uuidv4(),
            reviewId,
            userId,
            operation: "SUB",
            pointDelta: latestRewardRecord.pointDelta,
            reason: "MOD",
          })

          await new Promise(res => setTimeout(res, 1000))

          await reviewRewardModel.save({
            rewardId: uuidv4(),
            reviewId,
            userId,
            operation: "ADD",
            pointDelta: totalPoint,
            reason: "MOD",
          })

          const userModel = db.getUserModel()
          const currPoint = await userModel.findUserRewardPoint(userId)
          await userModel.updateReviewPoint(userId, currPoint + diff)

          const result = await userModel.findUserRewardPoint(userId)
          expect(result).toEqual(2)
        }
      }
    })

    // action이 MOD이면
    // 첫번째 리뷰인지 확인 (reviewId와 rewarded 플래그로 Review 테이블을 조회하여 첫번째 레코드인지 확인)
    // => true이면 
    // 장소에 보너스 점수가 있는지 확인
    // content와 attachedPhotoIds로부터 점수 계산
    //   => 유저 점수 timestamp(이력) 테이블에서 점수 부여된 내역을 확인
    //   => 유저 점수와 계산된 점수를 비교하여 점수 가감이 필요한 경우 관련 레코드 생성
    // => false이면 리턴
  })
})