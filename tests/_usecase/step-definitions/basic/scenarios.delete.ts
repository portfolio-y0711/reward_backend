import DatabaseConnector, { IDatabaseConnector } from '@app/data/connection'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { preconditions } from '../shared/preconditions.mod'
import { Database, IEventDatabase } from '@app/data'
import { IReviewPointEvent } from '@app/services/event-handlers/review/action-handlers/handler.review-event'

const feature = loadFeature('./tests/_usecase/features/basic/scenarios.delete.feature')

defineFeature(feature, (test) => {
  test('사용자가 기존에 작성하였던 리뷰를 삭제함', async({ given, and, when, then }) => {
    let databaseConnector: IDatabaseConnector
    let db: IEventDatabase

    databaseConnector = DatabaseConnector({
      filename: './feature.db'
    })

    db = Database(databaseConnector)

    preconditions(db)({ given, and })
    
    given('유저의 과거 포인트 부여 기록이 아래와 같음', async(placeId: string) => {
      // const reviewModel = db.getReviewModel()
      // const reviewCount = await reviewModel.findReviewCountsByPlaceId(placeId)
      // expect(reviewCount).toEqual(0)
    })


    when('유저가 아래와 같이 작성했던 리뷰를 삭제함', async(_reviewEvents: IReviewPointEvent[]) => {
      // const service = EventRouter({
      //   "REVIEW": ReviewEventActionRouter(db),
      //   "BLAR_BLAR": mock<IEventHandler>()
      // })
      // const reviewEvents = _reviewEvents.map(event => ({ ...event, attachedPhotoIds: (event.attachedPhotoIds as any).split(",")}))
      // await service.handleEvent(reviewEvents[0])
    })

    then('유저의 포인트 총점이 아래와 같아짐', async(userInfo: { userId: string, totalPoint: string }[]) => {
      // const userModel = db.getUserModel()
      // const expected = parseInt(userInfo[0].totalPoint)
      // const result = await userModel.findUserRewardPoint(userInfo[0].userId)
      // expect(result).toEqual(expected)
    })
  })
})