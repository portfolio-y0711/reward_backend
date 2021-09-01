import { IEventDatabase } from '@app/data'
import { IReviewReward } from '@app/data/models/user-review-reward'
import { mock } from 'jest-mock-extended'

export interface IUserService {
  fetchUserReviewPoint: (userId: string) => Promise<number>
  fetchUserRewards: (userId: string) => Promise<IReviewReward>
}

export const createUserService = (db: IEventDatabase): IUserService => {
  const fetchUserReviewPoint = async (userId: string) => {
    const userModel = db.getUserModel()
    return await userModel.findUserRewardPoint(userId)
  }
  return {
    ...mock<IUserService>(),
    fetchUserReviewPoint,
  }
}

export default createUserService
