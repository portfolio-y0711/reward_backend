import { IDatabaseConnector } from "./connection"
import createModel from '../data/models'
import { IUserModel } from './models/user'
import { IPlaceModel } from './models/place'
import { IReviewModel } from './models/review'
import { users } from '@datasource/index'

interface IDatabase {
  init: () => Promise<void>
  getUserModel: () => IUserModel
  getPlaceModel: () => IPlaceModel
  getReviewModel: () => IReviewModel
}

export const Database = (dbConnector: IDatabaseConnector): IDatabase => {
  let userModel: IUserModel
  let placeModel: IPlaceModel
  let reviewModel: IReviewModel

  const init = async() => {
    [ userModel, placeModel, reviewModel ] = createModel(dbConnector)


    await userModel.dropSchema()
    await userModel.createSchema()

    await Promise.all(users.map(async(user: any) => 
      await userModel.save({
        uuid: user.uuid,
        name: user.name
      })
    ))

    await placeModel.dropSchema()
    await placeModel.createSchema()


    await reviewModel.dropSchema()
    await reviewModel.createSchema()
  }
  return {
    init,
    getUserModel: () => userModel,
    getPlaceModel: () => placeModel,
    getReviewModel: () => reviewModel
  }
}