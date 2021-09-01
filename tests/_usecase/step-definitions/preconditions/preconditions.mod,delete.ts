import { IUser } from '@app/data/models/user'
import { IPlace } from '@app/data/models/place'
import { DefineStepFunction } from 'jest-cucumber'
import { IEventDatabase } from '@app/data'
import { IReview } from '@app/data/models/review'
import { IReviewReward } from '@app/data/models/user-review-reward'

export const preconditions = (db: IEventDatabase) => {
  return async ({ given, and }: { given: DefineStepFunction; and: DefineStepFunction }) => {
    db.init()

    given('아래와 같이 특정 장소가 등록되어 있음', async (places: IPlace[]) => {
      const placeModel = db.getPlaceModel()
      await placeModel.createSchema()
      await Promise.all(
        places.map((place) => {
          return placeModel.save(place)
        }),
      )
      const expected = places.map((p) => ({ ...p, bonusPoint: parseInt(p.bonusPoint as any) }))[0]
      const result = await placeModel.findPlaceByName(places[0].name)
      expect(result).toEqual(expect.objectContaining(expected))
    })

    and('아래와 같이 특정 유저가 등록되어 있음', async (users: IUser[]) => {
      const userModel = db.getUserModel()
      await userModel.createSchema()
      await Promise.all(
        users.map((user) => {
          return userModel.save({
            userId: user.userId,
            name: user.name,
            rewardPoint: parseInt(user.rewardPoint as any),
          })
        }),
      )
      const expected = users.map((user) => ({
        ...user,
        rewardPoint: parseInt(user.rewardPoint as any),
      }))[0]
      const result = (await userModel.findUsers())[0]
      expect(result).toEqual(expect.objectContaining(expected))
    })

    and('유저가 아래와 같이 특정 장소에 대해 리뷰를 작성하였음', async (review: IReview[]) => {
      const reviewModel = db.getReviewModel()
      await reviewModel.createSchema()
      await Promise.all(
        review.map((review) => {
          return reviewModel.save({
            reviewId: review.reviewId,
            placeId: review.placeId,
            content: review.content,
            attachedPhotoIds: (review.attachedPhotoIds as any).split(','),
            userId: review.userId,
            rewarded: review.rewarded,
          })
        }),
      )
    })

    and(
      '리뷰 작성에 대한 보상으로 아래와 같이 유저에게 포인트가 부여되었음',
      async (reward: IReviewReward[]) => {
        const rewardModel = db.getReviewRewardModel()
        await rewardModel.createSchema()
        await Promise.all(
          reward.map((reward) => {
            return rewardModel.save({
              rewardId: reward.rewardId,
              userId: reward.userId,
              reviewId: reward.reviewId,
              operation: reward.operation,
              pointDelta: reward.pointDelta,
              reason: reward.reason,
            })
          }),
        )
      },
    )
  }
}
