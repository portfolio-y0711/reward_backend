import { GetUserReviewPoint } from '@app/controllers/user/impl/controller.get-user-review-point'
import { IUserService } from '@app/services/user'
import { IHttpRequest } from '@app/typings'
import { mock, MockProxy} from 'jest-mock-extended'

describe('[Point] controller => service', () => {
  let mockUserService: MockProxy<IUserService>

  beforeAll(() => {
    mockUserService = mock<IUserService>()
  })

  describe('when [POST: /events =>]', () => {
    it('controller.getUserReviewPoint => service.fetchUserReviewPoint', async() => {
      const getUserReviewPoint = GetUserReviewPoint(mockUserService)

      const httpRequest: IHttpRequest = {
        body: {},
        params: { userId: "3ede0ef2-92b7-4817-a5f3-0c575361f745" },
        query: {}
      }
      await getUserReviewPoint(httpRequest)
      expect(mockUserService.fetchUserReviewPoint).toBeCalledTimes(1)
      expect(mockUserService.fetchUserReviewPoint).toBeCalledWith(httpRequest.params.userId)
    })
  })
})