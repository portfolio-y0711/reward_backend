import { IDatabaseConnector } from '../connection'

import { PlaceModel } from './place'
import { IUserModel } from './user'
import { UserModel } from './user'
import { IReviewModel, ReviewModel } from './review'
import { IPlaceModel } from './place/index'
import { IUserRewardModel } from './user-review-reward'
import { UserRewardModel } from './user-review-reward/index';

export default (conn: IDatabaseConnector): [IUserModel, IPlaceModel, IReviewModel, IUserRewardModel] => {
  return [UserModel(conn), PlaceModel(conn), ReviewModel(conn), UserRewardModel(conn)]
}
