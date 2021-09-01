import { IEventDatabase } from '@app/data'
import { IReviewReward } from '@app/data/models/user-review-reward'

export interface IUserService {
  fetchUserReviewPoint: (userId: string) => Promise<number>
  fetchUserRewards: (userId: string) => Promise<IReviewReward[]>
}

export const createUserService = (db: IEventDatabase): IUserService => {
  const fetchUserReviewPoint = async (userId: string) => {
    const userModel = db.getUserModel()
    return await userModel.findUserRewardPoint(userId)
  }
  const fetchUserRewards = async (userId: string) => {
    const userRewardModel = db.getReviewRewardModel()
    return await userRewardModel.findUserReviewRewardsByUserId(userId)
  }
  return {
    fetchUserReviewPoint,
    fetchUserRewards,
  }
}

export default createUserService
