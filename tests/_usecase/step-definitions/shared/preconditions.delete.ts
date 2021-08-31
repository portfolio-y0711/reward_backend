import { IUser } from '@app/data/models/user'
import { IPlace } from '@app/data/models/place'
import { DefineStepFunction } from 'jest-cucumber'
import { IEventDatabase } from '@app/data'

export const preconditions
  = (db: IEventDatabase) => {
    return async ({ given, and }: { given: DefineStepFunction, and: DefineStepFunction }) => {
      await db.init()

      given('아래와 같이 특정 장소가 등록되어 있음', async (places: IPlace[]) => {
        const placeModel = db.getPlaceModel()
        await placeModel.createSchema()
        await Promise.all(places.map(place => {
          return placeModel.save(place)
        }))
        const expected = places.map(p => ({ ...p, bonusPoint: parseInt(p.bonusPoint as any) }))[0]
        const result = await placeModel.findPlaceByName(places[0].name)
        expect(result).toEqual(expect.objectContaining(expected))
      })

      and('아래와 같이 특정 유저가 등록되어 있음', async (users: IUser[]) => {
        // const userModel = db.getUserModel()
        // await userModel.createSchema()
        // await Promise.all(users.map(user => {
        //   return userModel.save({
        //     userId: user.userId,
        //     name: user.name,
        //     rewardPoint: parseInt(user.rewardPoint as any)
        //   })
        // }))
        // const expected = users.map(user => ({ ...user, rewardPoint: parseInt(user.rewardPoint as any) }))[0]
        // const result = (await userModel.findUsers())[0]
        // expect(result).toEqual(expect.objectContaining(expected))
      })

      and('유저가 아래와 같이 특정 장소에 대해 리뷰를 작성하여 포인트가 발급되었음', async (users: IUser[]) => {
        // const userModel = db.getUserModel()
        // await userModel.createSchema()
        // await Promise.all(users.map(user => {
        //   return userModel.save({
        //     userId: user.userId,
        //     name: user.name,
        //     rewardPoint: parseInt(user.rewardPoint as any)
        //   })
        // }))
        // const expected = users.map(user => ({ ...user, rewardPoint: parseInt(user.rewardPoint as any) }))[0]
        // const result = (await userModel.findUsers())[0]
        // expect(result).toEqual(expect.objectContaining(expected))
      })
    }
  }
