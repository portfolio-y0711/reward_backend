import { IEventRouteService as IEventRouteService } from '@app/services/event'
import { IHttpRequest, IHttpResponse } from '@app/typings'

export const PostEvent = (service: IEventRouteService) => {
  return async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const { body } = httpRequest
    try {
      await service.handleEvent(body)
    } catch (e) {
      return {
        statusCode: 500,
        message: 'event processing failed',
      }
    }

    return {
      statusCode: 200,
      message: 'event processing succeeded',
    }
  }
}
