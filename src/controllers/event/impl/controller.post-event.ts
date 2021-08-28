import { IEventHandlingService } from "@app/services"
import { IHttpRequest, IHttpResponse } from "@app/typings"

export const PostEvent = (service: IEventHandlingService) => {
  return async (_: IHttpRequest): Promise<IHttpResponse> => {
    return await new Promise((res) =>
      setTimeout(res, 1000, {
        statusCode: 200,
        message: 'events registered successfully'
      }),
    )
  }
}
