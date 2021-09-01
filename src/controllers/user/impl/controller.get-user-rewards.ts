import { IUserService } from '@app/services/user'
import { IHttpRequest, IHttpResponse } from '@app/typings'

export const GetUserReward = (service: IUserService) => {
  return async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const {
      params: { userId },
    } = httpRequest

    let httpResponse: IHttpResponse

    return service
      .fetchUserRewards(userId as any)
      .then((res) => {
        httpResponse = {
          statusCode: 200,
          body: res,
        }
        return httpResponse
      })
      .catch((err) => {
        httpResponse = {
          statusCode: 500,
          message: err,
        }
        return httpResponse
      })
  }
}
