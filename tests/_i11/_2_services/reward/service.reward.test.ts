import { Database, IEventDatabase } from '@app/data'
import { createUserService, IUserService } from '@app/services/user'
import DatabaseConnector from '@app/data/connection'
import { IDatabaseConnector } from '@app/data/connection'
import { uuidv4 } from '@app/util'

describe('[User] service => database', () => {
  let conn: IDatabaseConnector
  let db: IEventDatabase
  let userService: IUserService

  beforeAll(async () => {
    conn = DatabaseConnector({
      filename: 'i11.db',
    })
    db = Database(conn)
    await db.init()
    await db.clear()
    userService = createUserService(db)
  })

  afterEach(async () => {
    await db.clear()
    jest.clearAllMocks()
  })

  describe('when [GET: /users/{userId}/rewardPoint => controller.getUserReviewPoint]', () => {
    it('service.fetchUserRewardPoint => database.findUserRewardPoint', async () => {
      const userModel = db.getUserModel()
      await userModel.save({
        userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
        name: 'Michael',
        rewardPoint: 1,
      })

      const rewardPoint = await userService.fetchUserReviewPoint(
        '3ede0ef2-92b7-4817-a5f3-0c575361f745',
      )
      expect(rewardPoint).toEqual(1)
    })
  })

  describe('when [GET: /users/{userId}/rewards => controller.getUserRewards]', () => {
    it('service.fetchUserRewards => database.findUserReviewRewardsByUserId', async () => {
      const userId = '3ede0ef2-92b7-4817-a5f3-0c575361f745'
      const reviewId = '240a0658-dc5f-4878-9381-ebb7b2667772'
      const userRewardModel = db.getReviewRewardModel()
      await userRewardModel.save({
        rewardId: uuidv4(),
        userId,
        reviewId,
        operation: 'ADD',
        pointDelta: 3,
        reason: 'NEW',
      })

      await userRewardModel.save({
        rewardId: uuidv4(),
        userId,
        reviewId,
        operation: 'SUB',
        pointDelta: 3,
        reason: 'MOD',
      })

      await userRewardModel.save({
        rewardId: uuidv4(),
        userId,
        reviewId,
        operation: 'ADD',
        pointDelta: 2,
        reason: 'MOD',
      })

      const rewards = await userService.fetchUserRewards(userId)
      expect(rewards.length).toEqual(3)
    })
  })
})
