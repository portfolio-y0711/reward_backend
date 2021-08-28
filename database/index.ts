import path from 'path'
import fs from 'fs'

export const users = (() => {
  let json: string
  fs.existsSync(path.join(__dirname, './seed/users.json'))
    ? (json = fs.readFileSync(path.join(__dirname, './seed/users.json'), 'utf-8'))
    : (json = '[]')
  return JSON.parse(json)
})()

export const places = (() => {
  let json: string
  fs.existsSync(path.join(__dirname, './seed/places.json'))
    ? (json = fs.readFileSync(path.join(__dirname, './seed/places.json'), 'utf-8'))
    : (json = '[]')
  return JSON.parse(json)
})()

export const reviews = (() => {
  let json: string
  fs.existsSync(path.join(__dirname, './seed/reviews.json'))
    ? (json = fs.readFileSync(path.join(__dirname, './seed/reviews.json'), 'utf-8'))
    : (json = '[]')
  return JSON.parse(json)
})()