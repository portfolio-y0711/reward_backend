import express from "express"

export interface IUserController {
  getUserReviewPoint: (req: express.Request, res: express.Response) => void
}
