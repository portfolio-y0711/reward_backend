import DatabaseConnector from '@app/data/connection'
import { Database } from "sqlite3"

export const TestDatabase = (() => {
  let conn: Database
  const getConnection = async() => {
    if (conn == undefined) {
      conn = await DatabaseConnector({
        filename: './i11.db'
      }).getConnection()
    } else {
      return conn
    }
  }
  return {
    getConnection
  }
})()