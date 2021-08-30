import { Database, IEventDatabase } from "@app/data"
import DatabaseConnector, { IDatabaseConnector } from "@app/data/connection"
import { IUser, UserModel } from "@app/data/models/user"
import { UserSeeder } from "@tests/helpers"

describe('[MODEL] USERS', () => {
  let databaseConnector: IDatabaseConnector
  let db: IEventDatabase
  let userSeeder: (user: IUser) => Promise<void>

  beforeAll(async() => {
    databaseConnector = DatabaseConnector({
      filename: './i11.db'
    })
    db = Database(databaseConnector)
    await db.init()

    userSeeder = UserSeeder(db)
  })

  afterEach(async() => {
    await db.clear()
  })

  it('handlers.handleReviewEvent <= userModel.findUserRewardPoint', async() => {
    const userId = "3ede0ef2-92b7-4817-a5f3-0c575361f745"
    const userModel = UserModel(databaseConnector)

    await userSeeder({
      userId,
      name: 'Michael',
      rewardPoint: 20
    })

    const userRewardPoint = await userModel.findUserRewardPoint(userId)
    expect(userRewardPoint).toEqual(20)
  })
})