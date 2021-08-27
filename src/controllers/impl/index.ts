import { IEventHandlingService } from "@app/services"
import { IHttpRequest, IHttpResponse } from "src/typings"

export const Test = (service: IEventHandlingService) => {
  return async(httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    service.test()
    return await new Promise(res => setTimeout(res, 1000, ({
        statusCode: 200,
        message: 'test!!!',
      })
    ))
  }
}