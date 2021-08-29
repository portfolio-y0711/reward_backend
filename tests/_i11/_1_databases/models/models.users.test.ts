import { Database, IEventDatabase } from "@app/data"
import DatabaseConnector, { IDatabaseConnector } from "@app/data/connection"
import { IPlace } from "@app/data/models/place"
import { IReview } from "@app/data/models/review"
import { FindReviewCountsByPlaceId } from "@app/data/models/review/dml/query/impl/find-review-counts-by-placeId"
import { IUser } from "@app/data/models/user"
import { PlaceSeeder, ReviewSeeder, UserSeeder } from "@tests/helpers"
import { IUserReward, UserRewardModel } from "@app/data/models/user-review-reward"

describe('[MODEL] EventDatabase <= USERS', () => {
  let databaseConnector: IDatabaseConnector
  let db: IEventDatabase
  let placeSeeder: (place: IPlace) => Promise<void>
  let userSeeder: (user: IUser) => Promise<void>
  let reviewSeeder: (review: IReview) => Promise<void>
  let findReviewCountsByPlaceId: (id: string) => Promise<number>

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
    findReviewCountsByPlaceId = FindReviewCountsByPlaceId(databaseConnector)
  })

  it('handlers.handleReviewEvent <= userModel.findUserTotalPoints', async() => {
    const userId = "3ede0ef2-92b7-4817-a5f3-0c575361f745"
    const rewardId = "c92fd7a6-991e-4484-8829-ae262cd6937b"
    const reviewId = "240a0658-dc5f-4878-9381-ebb7b2667772"

    const userRewardModel = UserRewardModel(databaseConnector)
    await userRewardModel.save({
      userId,
      rewardId,
      reviewId,
      operation: "ADD",
      pointDelta: 3,
      reason: "NEW",
    })
    
    const conn = await databaseConnector.getConnection()
    const sql = `SELECT * FROM USERS_REWARDS WHERE rewardId = '${rewardId}'`
    const reward = await new Promise<IUserReward>((res, rej) => {
      conn.get(sql, function(this, err, row) {
        if (err) {
          rej(err.message)
        } else {
          res(row)
        }
      })
    })
    expect(reward.pointDelta).toEqual(3)
  })
})