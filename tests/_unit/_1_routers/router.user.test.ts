import { IUserController } from '@app/controllers'
import createRouter from '@app/routers'
import express from 'express'
import request, { Request, Response } from 'supertest'

describe('[User] router test => controller.test', () => {
  let spy: jest.Mock<any, any>

  beforeAll(() => {
    spy = jest.fn()
  })

  it('GET: /api/events', (done) => {
    spy.mockImplementation((req: express.Request, res: express.Response) => {
      res.status(200)
      res.json('')
    })

    const controller: IUserController = { 
      test: spy
    }

    const router = createRouter(controller)
    const app = express()
    app.use(router)

    void request(app)
      .get('/api/events')
      .end((_err: Request, _res: Response) => {
        expect(spy).toBeCalledTimes(1)
        done()
      })
      

  })
})