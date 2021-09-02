import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreatePlaceTableIndex = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sqls = [
      `CREATE INDEX IF NOT EXISTS index_places_country ON PLACES(country);`,
      `CREATE INDEX IF NOT EXISTS index_places_name ON PLACES(name);`,
      `CREATE INDEX IF NOT EXISTS index_places_country_name ON PLACES(country,name);`,
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
