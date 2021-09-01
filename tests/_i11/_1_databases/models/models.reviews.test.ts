import { Database, IEventDatabase } from '@app/data'
import DatabaseConnector, { IDatabaseConnector } from '@app/data/connection'
import { IPlace } from '@app/data/models/place'
import { BooleanCode, IReview } from '@app/data/models/review'
import { FindReviewCountsByPlaceId } from '@app/data/models/review/dml/query/impl/find-review-counts-by-placeId'
import { IUser } from '@app/data/models/user'
import { PlaceSeeder, ReviewSeeder, UserSeeder } from '@tests/helpers'
import { uuidv4 } from '@app/util'

describe('[MODEL] REVIEWS', () => {
  let databaseConnector: IDatabaseConnector
  let db: IEventDatabase

  let placeSeeder: (place: IPlace) => Promise<void>
  let userSeeder: (user: IUser) => Promise<void>
  let reviewSeeder: (review: IReview) => Promise<void>

  let findReviewCountsByPlaceId: (id: string) => Promise<number>

  beforeAll(async () => {
    databaseConnector = DatabaseConnector({
      filename: './i11.db',
    })
    db = Database(databaseConnector)
    await db.init()
    placeSeeder = PlaceSeeder(db)
    userSeeder = UserSeeder(db)
    reviewSeeder = ReviewSeeder(db)
  })

  afterEach(async () => {
    await db.clear()
  })

  it('handlers.handleReviewEvent <= reviewModel.findReviewCountsByPlaceId', async () => {
    findReviewCountsByPlaceId = FindReviewCountsByPlaceId(databaseConnector)

    const placeId = '2e4baf1c-5acb-4efb-a1af-eddada31b00f'
    const userId = '3ede0ef2-92b7-4817-a5f3-0c575361f745'

    await userSeeder({
      userId,
      name: 'michael',
      rewardPoint: 0,
    })
    await placeSeeder({
      placeId,
      country: '호주',
      name: '멜번',
      bonusPoint: 0,
    })
    await reviewSeeder({
      reviewId: uuidv4(),
      placeId,
      userId,
      attachedPhotoIds: [],
      content: '좋아요',
      rewarded: BooleanCode.False,
    })

    const reviewCount = await findReviewCountsByPlaceId(placeId)
    expect(reviewCount).toEqual(1)
  })
})
