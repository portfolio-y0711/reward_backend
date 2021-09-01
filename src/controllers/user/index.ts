import { IUserService } from '@app/services/user'
import { Request, Response, NextFunction } from 'express'
import { AsyncRequestHandler } from '../async'
import { GetUserReviewPoint } from './impl/controller.get-user-review-point'
import { mock } from 'jest-mock-extended'

export interface IUserController {
  getUserReviewPoint: (req: Request, res: Response, next: NextFunction) => void
  getUserRewards: (req: Request, res: Response, next: NextFunction) => void
}

export default (service: IUserService): IUserController => {
  const getUserReviewPoint = AsyncRequestHandler(GetUserReviewPoint(service))
  return {
    getUserReviewPoint,
    getUserRewards: mock<IUserController>().getUserRewards,
  }
}
