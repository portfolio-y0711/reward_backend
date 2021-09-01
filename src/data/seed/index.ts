import path from 'path'
import fs from 'fs'

export const users = (() => {
  let json: string
  fs.existsSync(path.join(__dirname, './users.json'))
    ? (json = fs.readFileSync(path.join(__dirname, './users.json'), 'utf-8'))
    : (json = '[]')
  return JSON.parse(json)
})()

export const places = (() => {
  let json: string
  fs.existsSync(path.join(__dirname, './places.json'))
    ? (json = fs.readFileSync(path.join(__dirname, './places.json'), 'utf-8'))
    : (json = '[]')
  return JSON.parse(json)
})()

export const reviews = (() => {
  let json: string
  fs.existsSync(path.join(__dirname, './reviews.json'))
    ? (json = fs.readFileSync(path.join(__dirname, './reviews.json'), 'utf-8'))
    : (json = '[]')
  return JSON.parse(json)
})()
