import { IDatabaseConnector } from '@app/data/connection'
import _Promise from 'bluebird'
import { IPlace } from '@app/data/models/place'

export const FindPlaceByName = (conn: IDatabaseConnector) => {
  return async (name: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT * FROM PLACES WHERE name = '${name}'`

    return new _Promise<IPlace>((res, rej) => {
      return db.get(sql, function (this, err, row) {
        if (err) {
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(row)
        }
      })
    })
  }
}
