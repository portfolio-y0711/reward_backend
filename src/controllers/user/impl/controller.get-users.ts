import { IUserService } from '@app/services/users'
import { IHttpRequest, IHttpResponse } from '@app/typings'

export const GetUsers = (service: IUserService) => {
  return async (_: IHttpRequest): Promise<IHttpResponse> => {
    const users = await service.fetchUsers()
    return await new Promise((res) =>
      setTimeout(res, 1000, {
        statusCode: 200,
        body: users,
      }),
    )
  }
}
