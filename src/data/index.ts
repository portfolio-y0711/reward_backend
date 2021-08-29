import { IDatabaseConnector } from './connection'
import createModel from '../data/models'
import { IUserModel } from './models/user'
import { IPlaceModel } from './models/place'
import { IReviewModel } from './models/review'
import { reviews, users } from '@datasource/index'
import { places } from '@datasource/index'
import _Promise from 'bluebird'
import { BooleanCode } from './models/review/index'
import { IUserRewardModel } from './models/user-review-reward'

export interface ISchemaAdaptor {
  dropSchema: () => Promise<any>
  createSchema: () => Promise<any>
}

export interface IDatabase {
  init: () => Promise<void>
  seed: () => Promise<void>
  close: () => Promise<void>
  clear: () => Promise<void>
}
export interface IEventDatabase extends IDatabase {
  getUserModel: () => IUserModel
  getPlaceModel: () => IPlaceModel
  getReviewModel: () => IReviewModel
  getUserRewardModel: () => IUserRewardModel
}

export const Database = (dbConnector: IDatabaseConnector): IEventDatabase => {
  let userModel: IUserModel
  let placeModel: IPlaceModel
  let reviewModel: IReviewModel
  let userRewardModel: IUserRewardModel

  const close = async() => {
    const db = await dbConnector.getConnection()
    return new _Promise<void>((res, rej) => {
      db.close((err) => {
        if (err) {
          rej(err.message)
        } else {
          console.log('db closed')
          res()
        }
      })
    })
  }
  const init = async () => {
    [userModel, placeModel, reviewModel, userRewardModel] = createModel(dbConnector)

    // await userModel.dropSchema()
    await userModel.createSchema()
    // await userModel.createIndex()

    // await placeModel.dropSchema()
    await placeModel.createSchema()

    // await reviewModel.dropSchema()
    await reviewModel.createSchema()

    await userRewardModel.createSchema()
  }
  const clear = async () => {
    userModel.removeAll()
    placeModel.removeAll();
    reviewModel.removeAll()
    userRewardModel.removeAll()
  }
  const seed = async () => {

    await Promise.all(
      users.map(async (user: any) => {
        return await userModel.save(
          {
            userId: user.userId,
            name: user.name,
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
    getUserModel: () => userModel,
    getPlaceModel: () => placeModel,
    getReviewModel: () => reviewModel,
    getUserRewardModel: () => userRewardModel
  }
}
