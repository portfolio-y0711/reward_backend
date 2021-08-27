import { Test } from '@app/controllers/impl'
import { IEventHandlingService } from '@app/services'
import { IHttpRequest } from '@app/typings'
import { mock, MockProxy} from 'jest-mock-extended'

describe('[User] controller test', () => {

  let mockService: MockProxy<IEventHandlingService>

  beforeAll(() => {
    mockService = mock<IEventHandlingService>()
  })

  describe('when [GET: /api/events =>]', () => {
    it('controller.test => service.test', async() => {
      const testController = Test(mockService)
      const httpRequest: IHttpRequest = {
        body: {},
        params: {},
        query: {}
      }
      await testController(httpRequest)
      expect(mockService.test).toBeCalledTimes(1)
    })
  })
})