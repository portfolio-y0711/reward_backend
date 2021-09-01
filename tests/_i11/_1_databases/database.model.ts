import { Database, IEventDatabase } from '@app/data'
import DatabaseConnector, { IDatabaseConnector } from '@app/data/connection'
import { uuidv4 } from '@app/util'

describe('[Event] <= EventDatabase', () => {
  let databaseConnector: IDatabaseConnector
  let db: IEventDatabase

  beforeAll(() => {
    databaseConnector = DatabaseConnector({
      filename: './i11.db',
    })
    db = Database(databaseConnector)
    db.init()
  })

  it('handlers.handleReviewEvent <= reviewModel.findReviewCountsByPlaceId', async () => {
    ;(() => {
      const generatedId = uuidv4()
      const placeModel = db.getPlaceModel()
      placeModel.save({
        placeId: generatedId,
        country: '호주',
        name: '멜번',
        bonusPoint: 0,
      })
    })()

    const placeModel = db.getPlaceModel()
    const place = await placeModel.findPlaceByName('멜번')
    const reviewModel = db.getReviewModel()
    const reviewCount = await reviewModel.findReviewCountsByPlaceId(place.placeId)
    const userModel = db.getUserModel()
    const user = await userModel.findUserById('3ede0ef2-92b7-4817-a5f3-0c575361f745')
    userModel.updateReviewPoint(user.userId, 2)

    expect(reviewCount).toEqual(2)
  })

  it('handlers.handleReviewEvent <= placeModel.findBonusPoint.', async () => {
    const placeModel = db.getPlaceModel()
    const place = await placeModel.findPlaceByName('멜번')
    console.log(place)
    const reviewModel = db.getReviewModel()
    const reviewCount = await reviewModel.findReviewCountsByPlaceId(place.placeId)
    console.log(place.placeId)

    const userModel = db.getUserModel()
    const user = await userModel.findUserById('3ede0ef2-92b7-4817-a5f3-0c575361f745')
    userModel.updateReviewPoint(user.userId, 2)

    expect(reviewCount).toEqual(2)
  })

  it('handlers.handleReviewEvent <= userModel.saveReviewPoint.', async () => {
    const placeModel = db.getPlaceModel()
    const place = await placeModel.findPlaceByName('멜번')
    console.log(place)
    const reviewModel = db.getReviewModel()
    const reviewCount = await reviewModel.findReviewCountsByPlaceId(place.placeId)
    console.log(place.placeId)

    const userModel = db.getUserModel()
    const user = await userModel.findUserById('3ede0ef2-92b7-4817-a5f3-0c575361f745')
    userModel.updateReviewPoint(user.userId, 2)

    expect(reviewCount).toEqual(2)
  })
})
