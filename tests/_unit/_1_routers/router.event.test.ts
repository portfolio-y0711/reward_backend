import { IEventController } from '@app/controllers/event'
import createRouter from '@app/routers/event/routes'
import express from 'express'
import request, { Request, Response } from 'supertest'
import { mock } from 'jest-mock-extended'

describe('[Event] router => controller', () => {
  let spy: jest.Mock<any, any>

  beforeAll(() => {
    spy = jest.fn()
  })

  describe('when [POST: /events =>]', () => {
    it('router => controller.postEvent', (done) => {
      spy.mockImplementation((req: express.Request, res: express.Response) => {
        res.status(200)
        res.json('')
      })

      const controller: IEventController = {
        ...mock<IEventController>(),
        postEvent: spy,
      }

      const router = createRouter(controller)
      const app = express()
      app.use(router)

      void request(app)
        .post('/events')
        .end((_err: Request, _res: Response) => {
          expect(spy).toBeCalledTimes(1)
          done()
        })
    })
  })
})
