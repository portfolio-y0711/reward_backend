import { IEventHandlingService as IEventHandlingService } from '@app/services/event'
import { IHttpRequest, IHttpResponse } from '@app/typings'

export const PostEvent = (service: IEventHandlingService) => {
  return async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const { body } = httpRequest
    service.handleEvent(body).catch((rej) => {
      return {
        statusCode: 500,
        message: 'event processing failed',
      }
    })

    return {
      statusCode: 200,
      message: 'event processing succeeded',
    }
  }
}
