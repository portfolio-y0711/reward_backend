import { mock } from 'jest-mock-extended'
import { IEventDatabase } from '@app/data'
import { IUserModel } from '@app/data/models/user'
import { createUserService } from '@app/services/user'
import { IReviewRewardModel } from '../../../../src/data/models/user-review-reward/index'

describe('[User] service => database', () => {
  let spy: jest.Mock<any, any>

  beforeAll(() => {
    spy = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when [GET: /users/{userId}/rewardPoint => controller.getUserReviewPoint]', () => {
    it('service.fetchUserRewardPoint => database.findUserRewardPoint', async () => {
      const userModel: IUserModel = {
        ...mock<IUserModel>(),
        findUserRewardPoint: spy,
      }

      const mockDatabase: IEventDatabase = {
        ...mock<IEventDatabase>(),
        getUserModel: () => userModel,
      }

      const userService = createUserService(mockDatabase)
      await userService.fetchUserReviewPoint('3ede0ef2-92b7-4817-a5f3-0c575361f745')

      expect(spy).toBeCalledTimes(1)
      expect(spy).toBeCalledWith('3ede0ef2-92b7-4817-a5f3-0c575361f745')
    })
  })

  describe('when [GET: /users/{userId}/rewards => controller.getUserRewards]', () => {
    it('service.fetchUserRewards => database.findUserReviewRewardByUserId', async () => {
      const rewardModel: IReviewRewardModel = {
        ...mock<IReviewRewardModel>(),
        findUserReviewRewardsByUserId: spy,
      }

      const mockDatabase: IEventDatabase = {
        ...mock<IEventDatabase>(),
        getReviewRewardModel: () => rewardModel,
      }

      const userService = createUserService(mockDatabase)
      await userService.fetchUserReviewPoint('3ede0ef2-92b7-4817-a5f3-0c575361f745')

      expect(spy).toBeCalledTimes(1)
      expect(spy).toBeCalledWith('3ede0ef2-92b7-4817-a5f3-0c575361f745')
    })
  })
})
