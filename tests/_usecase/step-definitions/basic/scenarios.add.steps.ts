import DatabaseConnector, { IDatabaseConnector } from '@app/data/connection'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { preconditions } from '../preconditions/preconditions.add'
import { Database, IEventDatabase } from '@app/data'
import EventHandlerRouter, { IEventHandler } from '@app/services/event'
import { mock } from 'jest-mock-extended'
import { IReviewPointEvent, ReviewEventActionRouter } from '@app/services/event/review/actions'

const feature = loadFeature('./tests/_usecase/features/basic/scenarios.add.feature')

defineFeature(feature, (test) => {
  test('사용자가 리뷰를 새로 작성함', async ({ given, and, when, then }) => {
    let databaseConnector: IDatabaseConnector
    let db: IEventDatabase

    databaseConnector = DatabaseConnector({
      filename: `./feature.db`,
    })

    db = Database(databaseConnector)

    preconditions(db)({ given, and })

    given('아래 장소에 대한 리뷰글이 존재하지 않음', async (placeId: string) => {
      const reviewModel = db.getReviewModel()
      const reviewCount = await reviewModel.findReviewCountsByPlaceId(placeId)
      expect(reviewCount).toEqual(0)
    })

    when('유저가 아래와 같이 리뷰글을 작성함', async (_reviewEvents: IReviewPointEvent[]) => {
      const service = EventHandlerRouter({
        REVIEW: ReviewEventActionRouter(db).route,
        BLAR_BLAR: mock<IEventHandler>(),
      })
      const reviewEvents = _reviewEvents.map((event) => ({
        ...event,
        attachedPhotoIds: (event.attachedPhotoIds as any).split(','),
      }))
      await service.handleEvent(reviewEvents[0])
    })

    then(
      '유저의 포인트 총점이 아래와 같아짐',
      async (userInfo: { userId: string; totalPoint: string }[]) => {
        const userModel = db.getUserModel()
        const expected = parseInt(userInfo[0].totalPoint)
        const result = await userModel.findUserRewardPoint(userInfo[0].userId)
        expect(result).toEqual(expected)
      },
    )
  })
})
