// import { ApiError, CustomError } from '@app/typings'
// import { RequestHandler } from 'express'
// import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'

// const apiErrorHandler = (
//   err: TypeError | CustomError,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): ErrorRequestHandler => {
//   console.error(err)

//   if (err instanceof ApiError) {
//     res.status(err.code).json(err.message)
//     // return void
//   }

//   res.status(500).json('something went wrong')
// }
