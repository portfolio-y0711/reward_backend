import { IDatabaseConnector } from '../connection'

import { PlaceModel } from './place'
import { IUserModel } from './user'
import { UserModel } from './user'
import { IReviewModel, ReviewModel } from './review'
import { IPlaceModel } from './place/index'
import { IReviewRewardModel } from './user-review-reward'
import { ReviewRewardModel } from './user-review-reward/index';

export default (conn: IDatabaseConnector): [IUserModel, IPlaceModel, IReviewModel, IReviewRewardModel] => {
  return [UserModel(conn), PlaceModel(conn), ReviewModel(conn), ReviewRewardModel(conn)]
}
