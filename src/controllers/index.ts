import express, { NextFunction, Request, RequestHandler, Response } from 'express'

export interface IHttpRequest {
    body: Request["body"],
    query: Request["query"],
    params: Request["params"],
}

export interface IHttpResponse {
  statusCode: number,
  message?: string,
  body?: any,
} 


const AsyncRequestHandler = (requestHandler: (req: IHttpRequest) => Promise<IHttpResponse>) => {
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
            .json({
              body: httpResponse.body
            })
        } else {
          res
            .status(httpResponse.statusCode)
            .json({
              message: httpResponse.message
            })
        }
      })
      .catch((e) => {
        res.send(500)
      })
  }
}

export interface IUserController {
  test: (req: Request, res: Response, next: NextFunction) => void
}


const Test = () => {
  return async(httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    return await new Promise(res => setTimeout(res, 1000, ({
        statusCode: 200,
        message: 'test!!',
      })
    ))

    // return {
    //   statusCode: 200,
    //   message: 'test!!',

    // }
  }
}

export default (): IUserController => {
  // const test = async(req: Request, res: Response) => {
  //     res.json("test!")
  // }
  const test = AsyncRequestHandler(Test())
  return {
    test  
  }
}
