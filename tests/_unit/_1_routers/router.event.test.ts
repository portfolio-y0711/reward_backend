import { IEventController } from '@app/controllers/event'
import createRouter from '@app/routers/event/routes'
import express from 'express'
import request, { Request, Response } from 'supertest'
import { mock } from 'jest-mock-extended'
import { IReviewEvent } from '@app/typings'

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

      const event: IReviewEvent = {
        type: 'REVIEW',
        userId: 'userId',
        action: 'ADD',
        content: 'test',
        attachedPhotoIds: [],
        placeId: 'placeId',
        reviewId: 'reviewId',
      }

      const router = createRouter(controller)
      const app = express()
      app.use(express.json())
      // app.use(express.urlencoded( {extended: true } ))
      app.use(router)

      void request(app)
        .post('/events')
        .set('Accept', 'application/json')
        .type('application/json')
        // .type('form')
        .send(event)
        .end((_err: Request, _res: Response) => {
          expect(spy).toBeCalledTimes(1)
          done()
        })
    })
  })
})
