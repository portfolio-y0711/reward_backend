import _Promise from 'bluebird'
import { IDatabaseConnector } from '@app/data/connection'

export const CreateUserRewardTable = (conn: IDatabaseConnector) => {
  return async () => {
    const db = await conn.getConnection()

    const sql = `CREATE TABLE IF NOT EXISTS 
    USERS_REWARDS (
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

// userId "3ede0ef2-92b7-4817-a5f3-0c575361f745",
// name "Michael"
// reviewId "e50855fc-c1d5-42fb-9597-e0f02d8beb8b", nullable
// operation "add|subtract",
// delta 2
// reason "new|mod|del|redemp"
// timestamp
