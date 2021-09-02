import { ValidationError } from '@app/typings'
import { appLogger } from '@app/util/applogger'
import { Request, Response, NextFunction } from 'express'

export const validateDto = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedBody = await schema.validate(req.body)
      req.body = validatedBody
      next()
    } catch (err) {
      appLogger.error(`${err}`)
      next(ValidationError.badRequest(err))
    }
  }
}
