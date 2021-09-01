import express from 'express'
import createRouter  from '@app/routers/user/routes'
import { mock } from 'jest-mock-extended'
import request, { Request, Response } from 'supertest'
import { IUserController } from '@app/controllers/user'

describe('[User] router test => controller.test', () => {
  let spy: jest.Mock<any, any>

  beforeAll(() => {
    spy = jest.fn()
  })

  it('GET: /users/{userId}/rewardPoint', (done) => {
    spy.mockImplementation((req: express.Request, res: express.Response) => {
      res.status(200)
      res.json('')
    })

    const controller: IUserController = {
      ...mock<IUserController>(),
      getUserReviewPoint: spy
    }

    const router = createRouter(controller)
    const app = express()
    app.use(router)

    void request(app)
      .get('/users/3ede0ef2-92b7-4817-a5f3-0c575361f745/rewardPoint')
      .end((_err: Request, _res: Response) => {
        expect(spy).toBeCalledTimes(1)
        expect(spy.mock.calls[0][0]).toEqual(expect.objectContaining({ params: { userId: '3ede0ef2-92b7-4817-a5f3-0c575361f745' } }))
        done()
      })
  })
})