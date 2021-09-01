import { IDatabaseConnector } from '@app/data/connection'

export const RemoveAll = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()
    const sql = `DELETE FROM REWARDS`

    db.run(sql, function (err) {
      if (err) {
        console.log(err.message)
        console.log('error running sql ' + sql)
      }
    })
  }
}
