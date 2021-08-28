import { IDatabase } from '@app/data'
import { FetchUsers } from './impl/service.fetch-users'

export interface IUserService {
  fetchUsers: () => Promise<any>
}

const UserService = (db: IDatabase): IUserService => {
  const fetchUsers = FetchUsers(db)
  return {
    fetchUsers,
  }
}

export default UserService
