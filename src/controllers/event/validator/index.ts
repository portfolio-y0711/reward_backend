import { ApiError } from '@app/typings'
import { Request, Response, NextFunction } from 'express'

// function validationMiddleware<T>(type: any): express.RequestHandler {
//   return (req, res, next) => {
//     validate(plainToClass(type, req.body))
//       .then((errors: ValidationError[]) => {
//         if (errors.length > 0) {
//           const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
//           next(new HttpException(400, message));
//         } else {
//           next();
//         }
//       });
//   };
// }

export function validateDto(schema: any) {
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

