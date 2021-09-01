import { IDatabaseConnector } from "@app/data/connection"

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

export const runBatchAsync = (conn: IDatabaseConnector) => {
  return async (statements: string[]) => {
    const results: any = []
    const runAsync = RunAsync(conn)
    const batch = ['BEGIN', ...statements, 'COMMIT']
    return batch
      .reduce(
        (chain: Promise<any>, statement) =>
          chain.then(async (result) => {
            results.push(result)
            if (Array.isArray(statement)) {
              return await runAsync((statement as string[])[0], ...(statement as string[]).slice(1))
            } else return await runAsync(statement)
          }),
        Promise.resolve(),
      )
      .catch((err) => {
        console.log(err)
        runAsync('ROLLBACK').then(() => {
          console.log('err!!!')
          return Promise.reject(err + ' in statement #' + results.length)
        })
      })
      .then(() => results.slice(2))
  }
}
