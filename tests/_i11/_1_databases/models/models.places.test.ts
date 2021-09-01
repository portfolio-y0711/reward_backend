import { Database, IEventDatabase } from '@app/data'
import DatabaseConnector, { IDatabaseConnector } from '@app/data/connection'
import { IPlace } from '@app/data/models/place'
import { FindBonusPoint } from '@app/data/models/place/dml/query/impl/find-bonus-point'
import { PlaceSeeder } from '@tests/helpers'

describe('[MODEL] PLACES', () => {
  let databaseConnector: IDatabaseConnector
  let db: IEventDatabase

  let placeSeeder: (place: IPlace) => Promise<void>
  let findBonusPoint: (placeId: string) => Promise<number>

  beforeAll(async () => {
    databaseConnector = DatabaseConnector({
      filename: './i11.db',
    })
    db = Database(databaseConnector)
    await db.init()

    placeSeeder = PlaceSeeder(db)
  })

  afterEach(async () => {
    await db.clear()
  })

  it('handlers.handleReviewEvent <= reviewModel.findReviewCountsByPlaceId', async () => {
    findBonusPoint = FindBonusPoint(databaseConnector)

    const placeId = '2e4baf1c-5acb-4efb-a1af-eddada31b00f'
    await placeSeeder({
      placeId,
      country: '호주',
      name: '멜번',
      bonusPoint: 1,
    })

    const result = await findBonusPoint(placeId)
    expect(result).toEqual(1)
  })
})
