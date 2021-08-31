import { IUserService } from "@app/services/user"
import { IHttpRequest } from "@app/typings"

export const GetUserReviewPoint = (service: IUserService) => {
  return (httpRequest: IHttpRequest) => {
    const { params: { userId } } = httpRequest
    return service.fetchUserReviewPoint(userId as any)
  }
}