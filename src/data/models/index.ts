import { IDatabaseConnector } from '../connection'

import { PlaceModel } from './place'
import { IUserModel } from './user'
import { UserModel } from './user'
import { IReviewModel, ReviewModel } from './review'
import { IPlaceModel } from './place/index'

export default (conn: IDatabaseConnector): [IUserModel, IPlaceModel, IReviewModel] => {
  return [UserModel(conn), PlaceModel(conn), ReviewModel(conn)]
}