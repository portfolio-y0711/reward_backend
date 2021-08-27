import { Database } from 'sqlite3'

interface IDatabaseConfig {
  filename: string
}

export interface IDatabaseConnector {
  getConnection: () => Database
}

const DatabaseConnector = (config: IDatabaseConfig) => {
  let conn: Database
  const getConnection = () => {
    if (conn === undefined) {
      conn = new Database(config.filename, (err => {
        if (err) {
          console.log(err.message)
        }
        console.log('connected to database')
      }))
    }
    return conn
  }
  return {
    getConnection
  }
}

export default DatabaseConnector