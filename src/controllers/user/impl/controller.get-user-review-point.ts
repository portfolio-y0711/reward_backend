import { IUserService } from '@app/services/user'
import { IHttpRequest, IHttpResponse } from '@app/typings'

export const GetUserReviewPoint = (service: IUserService) => {
  return async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const {
      params: { userId },
    } = httpRequest
    let result: any
    let statusCode: number
    let httpResponse: IHttpResponse

    return service
      .fetchUserReviewPoint(userId as any)
      .then((res) => {
        result = res
        statusCode = 200
        httpResponse = {
          statusCode,
          body: {
            rewardPoint: result,
          },
        }
        return httpResponse
      })
      .catch((err) => {
        result = err.message
        statusCode = 500
        httpResponse = {
          statusCode,
          message: result,
        }
        return httpResponse
      })
  }
}
