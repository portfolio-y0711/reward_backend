import { IUserService } from '@app/services/user'
import { IHttpRequest } from '@app/typings'
import { mock, MockProxy } from 'jest-mock-extended'

describe('[Event] controller => service', () => {
  let mockUserService: MockProxy<IUserService>

  beforeAll(() => {
    mockUserService = mock<IUserService>()
  })

  describe('when [GET: /users/{userId}/rewards =>]', () => {
    it('controller.getUserRewards => service.fetchUserRewards', async () => {
      const GetUserRewards = (userService: IUserService) => {
        return async (httpRequest: IHttpRequest) => {
          const {
            params: { userId },
          } = httpRequest
          await userService.fetchUserRewards(userId)
        }
      }
      const getUserRewards = GetUserRewards(mockUserService)
      const httpRequest: IHttpRequest = {
        params: {
          userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
        },
        query: {},
        body: {},
      }
      await getUserRewards(httpRequest)
      expect(mockUserService.fetchUserRewards).toBeCalledTimes(1)
      expect(mockUserService.fetchUserRewards).toBeCalledWith(httpRequest.params.userId)
    })
  })
})
