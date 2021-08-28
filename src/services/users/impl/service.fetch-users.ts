import { IDatabase } from "@app/data"
import { IUser } from "@app/data/models/user"

export const FetchUsers = (db: IDatabase) => {
  return async (): Promise<IUser[]> => {
    const userModel = db.getUserModel()
    const users = userModel.findUsers()
    return users
  }
}