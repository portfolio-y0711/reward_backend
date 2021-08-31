import { IEventDatabase } from "@app/data"

export interface IUserService {
  fetchUserReviewPoint: (userId: string) => Promise<number>
}

export const createUserService = (db: IEventDatabase): IUserService => {
  const fetchUserReviewPoint = async (userId: string) => {
    const userModel = db.getUserModel()
    return await userModel.findUserRewardPoint(userId)
  }
  return {
    fetchUserReviewPoint
  }
}