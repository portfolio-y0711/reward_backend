import { IDatabaseConnector } from './connection'
import createModel from '../data/models'
import { IUserModel } from './models/user'
import { IPlaceModel } from './models/place'
import { IReviewModel } from './models/review'
import { reviews, users } from '@app/data/seed/index'
import { places } from '@app/data/seed/index'
import _Promise from 'bluebird'
import { BooleanCode } from './models/review/index'
import { IReviewRewardModel } from './models/user-review-reward'

export interface ISchemaAdaptor {
  dropSchema: () => Promise<any>
  createSchema: () => Promise<any>
}

export interface IDatabase {
  init: () => Promise<void>
  seed: () => Promise<void>
  close: () => Promise<void>
  clear: () => Promise<void>
  getConnector: () => IDatabaseConnector
}
export interface IEventDatabase extends IDatabase {
  getUserModel: () => IUserModel
  getPlaceModel: () => IPlaceModel
  getReviewModel: () => IReviewModel
  getReviewRewardModel: () => IReviewRewardModel
}

export const Database = (dbConnector: IDatabaseConnector): IEventDatabase => {
  let userModel: IUserModel
  let placeModel: IPlaceModel
  let reviewModel: IReviewModel
  let userRewardModel: IReviewRewardModel
  let conn: IDatabaseConnector

  const close = async () => {
    const db = await dbConnector.getConnection()
    return new _Promise<void>((res, rej) => {
      db.close((err) => {
        if (err) {
          rej(err.message)
        } else {
          res()
        }
      })
    })
  }
  const init = async () => {
    conn = dbConnector
    ;[userModel, placeModel, reviewModel, userRewardModel] = createModel(dbConnector)

    await userModel.dropSchema()
    await userModel.createSchema()
    // await userModel.createIndex()

    await placeModel.dropSchema()
    await placeModel.createSchema()

    await reviewModel.dropSchema()
    await reviewModel.createSchema()

    await userRewardModel.dropSchema()
    await userRewardModel.createSchema()
  }
  const clear = async () => {
    await userModel.removeAll()
    await placeModel.removeAll()
    await reviewModel.removeAll()
    await userRewardModel.removeAll()
  }
  const seed = async () => {
    await Promise.all(
      users.map(async (user: any) => {
        return await userModel.save(
          {
            userId: user.userId,
            name: user.name,
            rewardPoint: parseInt(user.rewardPoint),
          },
          user.id,
        )
      }),
    )

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
  return {
    close,
    init,
    seed,
    clear,
    getConnector: () => conn,
    getUserModel: () => userModel,
    getPlaceModel: () => placeModel,
    getReviewModel: () => reviewModel,
    getReviewRewardModel: () => userRewardModel,
  }
}
