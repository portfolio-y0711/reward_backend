import { IDatabaseConnector } from '@app/data/connection'
import _Promise from 'bluebird'

export const Close = (dbConnector: IDatabaseConnector) => async () => {
  const db = await dbConnector.getConnection()
  return new _Promise<void>((res, rej) => {
    db.close((err) => {
      if (err) {
        rej(err.message)
      } else {
        console.log('db closed')
        res()
      }
    })
  })
}
