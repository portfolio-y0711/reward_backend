import { uuidv4 } from '@app/util'
import { IDatabaseConnector } from '@app/data/connection'
import { IPlace } from '../../../index'
import _Promise from 'bluebird'

export const Save = (conn: IDatabaseConnector) => {
  return async (place: IPlace, id?: string) => {
    const db = await conn.getConnection()
    const { placeId, country, name, bonusPoint } = place

    const sql = `INSERT INTO PLACES(placeId,country,name,bonusPoint) VALUES('${
      placeId ?? uuidv4()
    }', '${country}', '${name}', '${bonusPoint}')`

    db.run(sql, function (err) {
      if (err) {
        console.log(err.message)
        console.log('error running sql ' + sql)
      }
    })
  }
}
