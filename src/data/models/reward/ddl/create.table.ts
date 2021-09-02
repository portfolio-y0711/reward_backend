import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateUserRewardTable = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sql = `CREATE TABLE IF NOT EXISTS 
    REWARDS (
      rewardId VARCHAR PRIMARY KEY,
      userId VARCHAR, 
      reviewId VARCHAR,
      operation VARCHAR NOT NULL,
      pointDelta INTEGER NOT NULL,
      reason VARCHAR NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

      CONSTRAINT fk_users_rewards_users
      FOREIGN KEY (userId)
      REFERENCES USERS (id)

    ) WITHOUT ROWID`

    new _Promise((res, rej) => {
      db.run(sql, function (err) {
        if (err) {
          console.log(err.message)
          console.log('error running sql ' + sql)
        }
      })
    })
  }
}
