import { IEventRouteService as IEventRouteService } from '@app/services/event'
import { IHttpRequest, IHttpResponse, ContextError } from '@app/typings';

export const PostEvent = (service: IEventRouteService) => {
  return async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const { body } = httpRequest
    try {
      await service.routeEvent(body)
    } catch (e: any) {
      switch(true) {
        case e instanceof ContextError:
          return {
            statusCode: (e as ContextError).code,
            message: (e as ContextError).message
          }
        default: 
          return {
            statusCode: 500,
            message: 'event processing failed',
          }
      }
    }

    return {
      statusCode: 200,
      message: 'event processing succeeded',
    }
  }
}
