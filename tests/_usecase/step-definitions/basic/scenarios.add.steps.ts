import DatabaseConnector, { IDatabaseConnector } from '@app/data/connection'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { preconditions } from '../preconditions/preconditions.add'
import { Database, IEventDatabase } from '@app/data'
import EventRouter, { IEventRoute } from '@app/services/event'
import { mock } from 'jest-mock-extended'
import { IReviewPointEvent, ReviewEventActionRouter } from '@app/services/event/review/actions'
import { IRewardRecord } from '@app/data/models/reward'
import { IReview } from '../../../../src/data/models/review/index';

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
      const service = EventRouter({
        REVIEW: ReviewEventActionRouter(db).route,
        BLAR_BLAR: mock<IEventRoute>(),
      })
      const reviewEvents = _reviewEvents.map((event) => ({
        ...event,
        attachedPhotoIds: (event.attachedPhotoIds as any).split(','),
      }))
      await service.routeEvent(reviewEvents[0])
    })

    then('유저의 리워드 레코드가 아래와 같이 생성됨', async(_reward: IRewardRecord[]) => {
      const rewardModel = db.getReviewRewardModel()
      const result = await rewardModel.findLatestUserReviewRewardByReviewId(_reward[0].userId, _reward[0].reviewId)
      const expected = _reward.map(r => ({
        pointDelta: parseInt(r.pointDelta as any), 
        reason: r.reason,
        reviewId: r.reviewId,
        userId: r.userId
      })
      )[0]
      expect(result).toEqual(expect.objectContaining(expected))
    })

    and(
      '유저의 포인트 총점이 아래와 같아짐',
      async (userInfo: { userId: string; rewardPoint: string }[]) => {
        const userModel = db.getUserModel()
        const expected = parseInt(userInfo[0].rewardPoint)
        const result = await userModel.findUserRewardPoint(userInfo[0].userId)
        expect(result).toEqual(expected)
      },
    )

    and('유저의 리뷰 레코드가 아래와 같이 생성됨', async(review: IReview[]) => { 
      const userReviewModel = db.getReviewModel()
      const result = await userReviewModel.checkRecordExistsByReviewId(review[0].reviewId)
      expect(result).toBeTruthy()
    })
  })
})
