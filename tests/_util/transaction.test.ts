import { IDatabaseConnector } from '@app/data/connection'
import DatabaseConnector from '@app/data/connection'

describe('[Util] Async Batch Tranaction for SQLite3', () => {
  let conn: IDatabaseConnector

  const RunAsync = (conn: IDatabaseConnector) => {
    return async (sql: string, ...params: any[]) => {
      const db = await conn.getConnection()
      return new Promise((res, rej) => {
        db.run(sql, params, function (this, err) {
          if (err) return rej(err)
          res(this)
        })
      })
    }
  }

  const runBatchAsync = (conn: IDatabaseConnector) => {
    return async (statements: string[]) => {
      const results: any = []
      const runAsync = RunAsync(conn)
      const batch = ['BEGIN', ...statements, 'COMMIT']
      return batch
        .reduce(
          (chain: Promise<any>, statement) =>
            chain.then((result) => {
              results.push(result)
              if (Array.isArray(statement)) {
                return runAsync((statement as string[])[0], ...(statement as string[]).slice(1))
              } else return runAsync(statement)
            }),
          Promise.resolve(),
        )
        .catch((err) =>
          runAsync('ROLLBACK').then(() => Promise.reject(err + ' in statement #' + results.length)),
        )
        .then(() => results.slice(2))
    }
  }

  beforeAll(async () => {
    conn = DatabaseConnector({
      filename: 'util.db',
    })
  })

  it('', async () => {
    const statements = [
      'DROP TABLE IF EXISTS foo;',
      'CREATE TABLE foo (id INTEGER NOT NULL, name TEXT);',
      ['INSERT INTO foo (id, name) VALUES (?, ?);', 1, 'First Foo'],
    ]

    await runBatchAsync(conn)(statements as any)
      .then((results) => {
        // console.log("SUCCESS!")
        // console.log(results);
      })
      .catch((err) => {
        console.error('BATCH FAILED: ' + err)
      })
  })
})
