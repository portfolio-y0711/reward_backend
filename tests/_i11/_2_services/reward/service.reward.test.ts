import { mock } from 'jest-mock-extended'
import { Database, IEventDatabase } from '@app/data'
import { IUserModel } from '@app/data/models/user'
import { createUserService, IUserService } from '@app/services/user'
import DatabaseConnector from '@app/data/connection'
import { IDatabaseConnector } from '@app/data/connection'

describe('[User] service => database', () => {
  let conn: IDatabaseConnector
  let db: IEventDatabase
  let userService: IUserService

  beforeAll(async() => {
    conn = DatabaseConnector({
      filename: "i11.db" 
    })
    db = Database(conn)
    await db.init()
    await db.clear()
    userService = createUserService(db)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('when [POST: /users/{userId}/points => controller.getUserReviewPoint]', () => {
    it('service.fetchUserRewardPoint => database.findUserRewardPoint', async() => {

      const userModel = db.getUserModel()
      userModel.save({
        userId: "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        name: "Michael",
        rewardPoint: 1
      })
       
      const rewardPoint = await userService.fetchUserReviewPoint("3ede0ef2-92b7-4817-a5f3-0c575361f745")
      expect(rewardPoint).toEqual(1)

    })
    
  })
})