import DatabaseConnector, { IDatabaseConnector } from '@app/data/connection'
import { defineFeature, loadFeature } from 'jest-cucumber'
import { preconditions } from '../preconditions/preconditions.mod,delete'
import { Database, IEventDatabase } from '@app/data'
import { IReviewPointEvent, ReviewEventActionRouter } from '@app/services/event/review/actions'
import EventRouter, { IEventRoute } from '@app/services/event'
import { mock } from 'jest-mock-extended'
import { IReview } from '@app/data/models/review'
import { IRewardRecord } from '@app/data/models/reward'

const feature = loadFeature('./tests/_usecase/features/basic/scenarios.mod.feature')

let db: IEventDatabase

defineFeature(feature, (test) => {
  test('사용자가 기존에 작성하였던 리뷰를 수정함', async ({ given, and, when, then }) => {
    let databaseConnector: IDatabaseConnector

    databaseConnector = DatabaseConnector({
      filename: './feature.db',
    })

    db = Database(databaseConnector)

    preconditions(db)({ given, and })

    given(
      '유저의 현재 포인트 총점은 아래와 같음',
      async (userInfo: { userId: string; totalPoint: string }[]) => {
        const userModel = db.getUserModel()
        const userPoint = await userModel.findUserRewardPoint(userInfo[0].userId)
        expect(userPoint).toEqual(parseInt(userInfo[0].totalPoint))
      },
    )

    when(
      '유저가 아래와 같이 작성했던 리뷰를 수정함',
      async (_reviewEvents: IReviewPointEvent[]) => {
        const service = EventRouter({
          REVIEW: ReviewEventActionRouter(db).route,
          BLAR_BLAR: mock<IEventRoute>(),
        })
        let attachedPhotoIds: string[]
        let attachedPhotoStr = _reviewEvents[0].attachedPhotoIds as any as string

        if (attachedPhotoStr == '') {
          attachedPhotoIds = []
        } else {
          if (attachedPhotoStr.includes(',')) {
            attachedPhotoIds = attachedPhotoStr.split(',')
          } else {
            attachedPhotoIds = [attachedPhotoStr]
          }
        }
        const reviewEvents = _reviewEvents.map((event) => ({ ...event, attachedPhotoIds }))
        await service.routeEvent(reviewEvents[0])
      },
    )

    then('유저의 리워드 레코드가 아래와 같이 변경됨', async (_reward: IRewardRecord[]) => {
      const rewardModel = db.getReviewRewardModel()
      const result = await rewardModel.findUserReviewRewardsByUserId(_reward[0].userId)
      const expected = _reward.map(r => ({
        pointDelta: parseInt(r.pointDelta as any),
        reason: r.reason,
        reviewId: r.reviewId,
        userId: r.userId
      }))

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining(expected[0]),
          expect.objectContaining(expected[1]),
          expect.objectContaining(expected[2])
        ])
      )
    })

    and(
      '유저의 포인트 총점이 아래와 같아짐',
      async (userInfo: { userId: string; totalPoint: string }[]) => {
        const userModel = db.getUserModel()
        const expected = parseInt(userInfo[0].totalPoint)
        const result = await userModel.findUserRewardPoint(userInfo[0].userId)
        expect(result).toEqual(expected)
      },
    )

    and('유저의 리뷰 레코드가 아래와 같이 변경됨', async (_review: IReview[]) => {
      const userReviewModel = db.getReviewModel()
      const result = await userReviewModel.findReviewByReviewId(_review[0].reviewId)
      const expected: IReview[] = _review.map((r:IReview) => ({
        userId: r.userId,  
        attachedPhotoIds: r.attachedPhotoIds,
        content: r.content,
        placeId: r.placeId,
        reviewId: r.reviewId,
        rewarded: parseInt(r.rewarded as any)
      }))
      expect(result).toEqual(expect.objectContaining(expected[0]))
    })
  })
})
