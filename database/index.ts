import path from 'path'
import fs from 'fs'

export const users = (() => {
  let json: string
  fs.existsSync(path.join(__dirname, './seed/user.json'))
    ? (json = fs.readFileSync(path.join(__dirname, './seed/user.json'), 'utf-8'))
    : (json = '[]')
  return JSON.parse(json)
})()