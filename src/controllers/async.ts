import { Request, Response, NextFunction } from 'express'
import { IHttpRequest, IHttpResponse } from './index'

export const AsyncRequestHandler = (requestHandler: (req: IHttpRequest) => Promise<IHttpResponse>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const httpRequest: IHttpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
    }
    requestHandler(httpRequest)
      .then((httpResponse: IHttpResponse) => {
        if (httpResponse.body) {
          res
            .status(httpResponse.statusCode)
            .json(httpResponse.body)
        } else {
          res
            .status(httpResponse.statusCode)
            .send({
              message: httpResponse.message
            })
        }
      })
      .catch((e) => {
        res.send(500)
      })
  }
}