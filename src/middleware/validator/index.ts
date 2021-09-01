import { ApiError } from '@app/typings'
import { Request, Response, NextFunction } from 'express'

export const validateDto = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = await schema.validate(req.body)
      req.body = validatedBody
      next()
    } catch (err) {
      console.log(err)
      next(ApiError.badRequest(err))
    }
  }
}
