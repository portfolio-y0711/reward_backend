import { Database, IEventDatabase } from '@app/data'
import { IReviewPointEvent, ReviewEventActionRouter, REVIEW_ACTION } from '@app/services/event-handlers/review/action-handlers/handler.review-event'
import DatabaseConnector from '@app/data/connection'
import { IDatabaseConnector } from '@app/data/connection'
import EventRouter, { IEventHandlingService } from '@app/services/event-handlers'
import { IEvent, EVENT_TYPE } from '@app/typings'
import { BlarBlarEventHandler } from '@app/services/event-handlers/review/action-handlers/blar_blar/handler.blar_blar-event'
import { IUser } from '@app/data/models/user'
import { IPlace } from '@app/data/models/place'
import { PlaceSeeder, UserSeeder } from '@tests/helpers'

describe('[Event: REVIEW, ADD] service => model', () => {
  let conn: IDatabaseConnector
  let db: IEventDatabase
  let service: IEventHandlingService

  let userSeeder: (user: IUser) => Promise<void>
  let placeSeeder: (place: IPlace) => Promise<void>

  beforeAll(async() => {
    conn = DatabaseConnector({
      filename: 'i11.db'
    })
    db = Database(conn)
    await db.init()
    await db.clear()

    service = EventRouter({
      "REVIEW": ReviewEventActionRouter(db).handleAction,
      "BLAR_BLAR": BlarBlarEventHandler(db)
    })

    userSeeder = UserSeeder(db)
    placeSeeder = PlaceSeeder(db)

  })

  afterEach(async() => {
    await db.clear()
  })

  describe('when [POST: /api/events => controller.postEvent => service.handleEvent => handlers.handleReviewEvent]', () => {
    it([
        'service.handleEvent =>',
      ].join('\n'), async() => {

      const type: EVENT_TYPE = "REVIEW"
      const action: REVIEW_ACTION = "ADD"
      const event: IReviewPointEvent & IEvent = {
        type,
        action,
        "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
        "content": "좋아요!",
        "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
        "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
      }
      await userSeeder({
        userId: event["userId"],
        name: "Michael",
        rewardPoint: 0
      })

      await placeSeeder({
        placeId: event["placeId"],
        bonusPoint: 1,
        country: "호주",
        name: "시드니"
      })

      await service.handleEvent(event)

      const userModel = db.getUserModel()
      const result = await userModel.findUserRewardPoint(event['userId'])
      expect(result).toEqual(3)
    })

    // if (action == "ADD")
    //
    //  const reviewModel = fakeDatabase.getReviewModel()
    //  const isRewardable = reviewModel.isFirstReview(placeId)

    //  if (rewardable) 
    //
    //    const placeModel = fakeDatabase.getPlaceModel()
    //    const bonusPoint = placeModel.findBonusPoint(placeId)
    //    const totalPoint = ((content.length > 1) ? 1 : 0)  + ((attachedPhotoIds.length > 1) ? 1 : 0) + bonusPoint
    //
    //    const userModel = fakeDatabase.getUserModel()
    //    userModel.saveReviewPoint(placeId, userId, contentPoint, photoPoint, bonusPoint)
    //
    // else { do nothing }
    //
    // 
    

    // action이 ADD이면
    // 첫번째 리뷰인지 확인 (placeId로 Review 테이블을 조회하여 레코드가 없는지 확인)
    // => true이면 
    // 장소에 보너스 점수가 있는지 확인
    // content와 attachedPhotoIds로부터 점수 계산
    //   => 점수 계산 후 유저 점수 부여
    // => false이면 리턴

    // if (action == "MOD")
    // 
    //

    // action이 MOD이면
    // 첫번째 리뷰인지 확인 (placeId와 reviewId로 Review 테이블을 조회하여 첫번째 레코드인지 확인)
    // => true이면 
    // 장소에 보너스 점수가 있는지 확인
    // content와 attachedPhotoIds로부터 점수 계산
    //   => 유저 점수 timestamp(이력) 테이블에서 점수 부여된 내역을 확인
    //   => 유저 점수와 계산된 점수를 비교하여 점수 가감이 필요한 경우 관련 레코드 생성
    // => false이면 리턴

    // action이 DELETE이면
    // 첫번째 리뷰인지 확인 (placeId와 reviewId로 Review 테이블을 조회하여 첫번째 레코드인지 확인)
    // 장소에 보너스 점수가 있는지 확인
    // => true이면 
    // content와 attachedPhotoIds로부터 점수 계산
    //   => 유저 점수 timestamp(이력) 테이블에서 점수 부여된 내역을 확인
    //   => 계산된 점수만큼 차감하는 레코드 생성
  })
})