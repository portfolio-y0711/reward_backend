import { Database } from 'sqlite3'
import _Promise from 'bluebird'

interface IDatabaseConfig {
  filename: string
}

export interface IDatabaseConnector {
  getConnection: () => Promise<Database>
}

const DatabaseConnector = (config: IDatabaseConfig) => {
  let conn: Database
  const getConnection = async () => {
    return new _Promise<Database>((resolve, reject) => {
      if (conn == undefined) {
        conn = new Database(config.filename, (err) => {
          if (err) {
            reject(err.message)
          } else {
            resolve(conn)
          }
        })
      } else {
        resolve(conn)
      }
    })
  }
  return {
    getConnection,
  }
}

export default DatabaseConnector
