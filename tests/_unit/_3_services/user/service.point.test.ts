import { mock } from 'jest-mock-extended'
import { IEventDatabase } from '@app/data'
import { IUserModel } from '@app/data/models/user'
import { createUserService, IUserService } from '@app/services/user'

describe('[User] service => database', () => {
  let spy: jest.Mock<any, any>

  beforeAll(() => {
    spy = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when [POST: /users/{userId}/points => controller.getUserReviewPoint]', () => {
    it('service.fetchUserRewardPoint => database.findUserRewardPoint', async() => {

      const userModel: IUserModel = {
        ...mock<IUserModel>(),
        findUserRewardPoint: spy
      }

      const mockDatabase: IEventDatabase = {
        ...mock<IEventDatabase>(),
        getUserModel: () => userModel
        
      }

      const userService = createUserService(mockDatabase)
      await userService.fetchUserReviewPoint("3ede0ef2-92b7-4817-a5f3-0c575361f745")

      expect(spy).toBeCalledTimes(1)
      expect(spy).toBeCalledWith("3ede0ef2-92b7-4817-a5f3-0c575361f745")
    })
    
  })
})