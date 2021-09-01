import { GetUserReviewPoint } from '@app/controllers/user/impl/controller.get-user-review-point'
import { Database, IEventDatabase } from '@app/data'
import DatabaseConnector, { IDatabaseConnector } from '@app/data/connection'
import { IUserService } from '@app/services/user'
import { IHttpRequest } from '@app/typings'
import { createUserService } from '@app/services/user/index'

describe('[Point] controller => service', () => {
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
    jest.clearAllMocks()
    await db.clear()
    await db.close()
  })

  describe('when [GET: /users/{userId}/rewardPoint =>]', () => {
    it('controller.getUserReviewPoint => service.fetchUserReviewPoint', async () => {
      const getUserReviewPoint = GetUserReviewPoint(userService)

      const userModel = db.getUserModel()
      await userModel.save({
        userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
        name: 'Michael',
        rewardPoint: 1,
      })

      const httpRequest: IHttpRequest = {
        body: {},
        params: { userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745' },
        query: {},
      }
      const result = await getUserReviewPoint(httpRequest)
      expect(result).toEqual({
        body: {
          rewardPoint: 1,
        },
        statusCode: 200,
      })
    })
  })

  describe('when [GET: /users/{userId}/rewards =>]', () => {
    it('controller.getUserRewards => service.fetchUserRewards', async () => {
      const getUserReviewPoint = GetUserReviewPoint(userService)

      const userModel = db.getUserModel()
      await userModel.save({
        userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745',
        name: 'Michael',
        rewardPoint: 1,
      })

      const httpRequest: IHttpRequest = {
        body: {},
        params: { userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745' },
        query: {},
      }
      const result = await getUserReviewPoint(httpRequest)
      expect(result).toEqual({
        body: {
          rewardPoint: 1,
        },
        statusCode: 200,
      })
    })
  })
})
