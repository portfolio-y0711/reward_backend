
  export interface IUserService {
    fetchUserReviewPoint: (userId: string) => Promise<number>
  }