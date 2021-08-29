import { IEventDatabase } from "@app/data"
import { IPlace } from "@app/data/models/place"
import { IUser } from "@app/data/models/user"
import { IReview } from '../../src/data/models/review/index'

export const PlaceSeeder
  = (db: IEventDatabase) => {
    return async (place: IPlace) => {
      const placeModel = db.getPlaceModel()
      await placeModel.save(place)
    }
  }

export const UserSeeder
  = (db: IEventDatabase) => {
    return async (user: IUser) => {
      const userModel = db.getUserModel()
      await userModel.save(user)
    }
  }

export const ReviewSeeder
  = (db: IEventDatabase) => {
    return async (review: IReview) => {
      const reviewModel = db.getReviewModel()
      await reviewModel.save(review)
    }
  }