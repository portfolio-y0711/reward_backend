import { BooleanCode } from '@app/data/models/review'
import { IEventDatabaseModels } from '@app/typings'
import { places, reviews, users } from '@datasource/index'

export const Seed = (context: IEventDatabaseModels) => async () => {
  const { userModel, placeModel, reviewModel } = context
  await userModel.dropSchema()
  await userModel.createSchema()
  await userModel.createIndex()

  await Promise.all(
    users.map(async (user: any) => {
      return await userModel.save(
        {
          userId: user.userId,
          name: user.name,
          rewardPoint: user.rewardPoint
        },
        user.id,
      )
    }),
  )

  await placeModel.dropSchema()
  await placeModel.createSchema()

  await Promise.all(
    places.map(async (place: any) => {
      return await placeModel.save(
        {
          placeId: place.placeId,
          country: place.country,
          name: place.name,
          bonusPoint: place.bonusPoint,
        },
        place.id,
      )
    }),
  )

  await reviewModel.dropSchema()
  await reviewModel.createSchema()

  await Promise.all(
    reviews.map(async (review: any) => {
      return await reviewModel.save(
        {
          reviewId: review.reviewId,
          placeId: review.placeId,
          attachedPhotoIds: review.attachedPhotoIds,
          content: review.content,
          userId: review.userId,
          rewarded: review.rewarded ? BooleanCode.True : BooleanCode.False,
        },
        review.id,
      )
    }),
  )
}
