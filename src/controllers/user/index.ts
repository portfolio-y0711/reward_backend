import { IUserService } from "@app/services/user"
import express from "express"
import { GetUserReviewPoint } from './impl/controller.get-user-review-point';

export interface IUserController {
  getUserReviewPoint: (req: express.Request, res: express.Response) => void
}

export default (service: IUserService): IUserController => {
  const getUserReviewPoint = GetUserReviewPoint(service)
  return {
    getUserReviewPoint
  }
}