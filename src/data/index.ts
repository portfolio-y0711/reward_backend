import { IDatabaseConnector } from './connection'
import createModel from '../data/models'
import { IUserModel } from './models/user'
import { IPlaceModel } from './models/place'
import { IReviewModel } from './models/review'
import { users } from '@datasource/index'
import { places } from '@datasource/index'
import _Promise from 'bluebird'

export interface IDatabase {
  init: () => Promise<void>
  seed: () => Promise<void>
  close: () => Promise<void>
  getUserModel: () => IUserModel
  getPlaceModel: () => IPlaceModel
  getReviewModel: () => IReviewModel
}

// export interface IEventDatabase extends IDatabase {
//   getUserModel: () => IUserModel
//   getPlaceModel: () => IPlaceModel
//   getReviewModel: () => IReviewModel
// }

export const Database = (dbConnector: IDatabaseConnector): IDatabase => {
  let userModel: IUserModel
  let placeModel: IPlaceModel
  let reviewModel: IReviewModel

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
  const init = async() => ([userModel, placeModel, reviewModel] = createModel(dbConnector), undefined)
  const seed = async () => {
    await userModel.dropSchema()
    await userModel.createSchema()

    await Promise.all(
      users.map(async (user: any) => {
        return await userModel.save(
          {
            uuid: user.uuid,
            name: user.name,
          },
          user.userId,
        )
      }),
    )

    await placeModel.dropSchema()
    await placeModel.createSchema()

    await Promise.all(
      places.map(async (place: any) => {
        return await placeModel.save(
          {
            uuid: place.uuid,
            name: place.name,
          },
          place.placeId,
        )
      }),
    )

    await reviewModel.dropSchema()
    await reviewModel.createSchema()
  }
  return {
    close,
    init,
    seed,
    getUserModel: () => userModel,
    getPlaceModel: () => placeModel,
    getReviewModel: () => reviewModel,
  }
}
