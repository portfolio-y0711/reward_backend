import { Database, IEventDatabase } from "@app/data"
import DatabaseConnector, { IDatabaseConnector } from "@app/data/connection"
import { IPlace } from "@app/data/models/place"
import { IReview } from "@app/data/models/review"
import { IUser } from "@app/data/models/user"
import { PlaceSeeder, ReviewSeeder, UserSeeder } from "@tests/helpers"
import { IReviewReward, ReviewRewardModel } from "@app/data/models/user-review-reward"

describe('[MODEL] USERS_REWARDS', () => {
  let databaseConnector: IDatabaseConnector
  let db: IEventDatabase

  let placeSeeder: (place: IPlace) => Promise<void>
  let userSeeder: (user: IUser) => Promise<void>
  let reviewSeeder: (review: IReview) => Promise<void>

  beforeAll(async() => {
    databaseConnector = DatabaseConnector({
      filename: './i11.db'
    })
    db = Database(databaseConnector)
    await db.init()
    await db.clear()
    placeSeeder = PlaceSeeder(db)
    userSeeder = UserSeeder(db)
    reviewSeeder = ReviewSeeder(db)
  })

  afterEach(async() => {
    await db.clear()
  })

  it('handlers.handleReviewEvent <= userRewardModel.save', async() => {
    const userId = "3ede0ef2-92b7-4817-a5f3-0c575361f745"
    const rewardId = "c92fd7a6-991e-4484-8829-ae262cd6937b"
    const reviewId = "240a0658-dc5f-4878-9381-ebb7b2667772"

    const userRewardModel = ReviewRewardModel(databaseConnector)
    const expected: IReviewReward = {
      userId,
      rewardId,
      reviewId,
      operation: "ADD",
      pointDelta: 3,
      reason: "NEW",
    }
    await userRewardModel.save(expected)
    
    const conn = await databaseConnector.getConnection()
    const sql = `SELECT * FROM USERS_REWARDS WHERE rewardId = '${rewardId}'`

    const result = await new Promise<IReviewReward>((res, rej) => {
      conn.get(sql, function(this, err, row) {
        if (err) {
          rej(err.message)
        } else {
          res(row)
        }
      })
    })
    expect(result).toEqual(expect.objectContaining(expected))
  })

})