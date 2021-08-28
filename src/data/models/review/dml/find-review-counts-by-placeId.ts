import { IDatabaseConnector } from "@app/data/connection"

export const FindReviewCountsByPlaceId
  = (conn: IDatabaseConnector) => {
    return async (placeId: string) => {
      return 0
    }
  }