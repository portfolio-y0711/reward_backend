import { IDatabaseConnector } from '@app/data/connection'
import { IPlace } from '../../../index'
import _Promise from 'bluebird'

export const FindBonusPoint = (conn: IDatabaseConnector) => {
  return async (placeId: string) => {
    const db = await conn.getConnection()
    const sql = `SELECT bonusPoint FROM PLACES WHERE placeId = '${placeId}'`

    return new _Promise<number>((res, rej) => {
      return db.get(sql, function (this, err, row) {
        if (err) {
          console.log('error running sql ' + sql)
          rej(err.message)
        } else {
          res(parseInt(row.bonusPoint))
        }
      })
    })
  }
}
