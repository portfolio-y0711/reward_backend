import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreatePlaceTableIndex = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sqls = [
      `CREATE UNIQUE INDEX idx_places_country ON REVIEWS(country)`,
      `CREATE UNIQUE INDEX idx_places_name ON REVIEWS(name)`,
      `CREATE UNIQUE INDEX idx_places_country_name ON REVIEWS(country,name)`,
    ]

    await _Promise.all(
      sqls.map((sql) => {
        return new _Promise((res, rej) => {
          return db.run(sql, function (err) {
            if (err) {
              console.log('error running sql ' + sql)
              rej(err.message)
            } else {
              res()
            }
          })
        })
      }),
    )
  }
}
