import { Request, Response, NextFunction } from 'express'
import bunyan from 'bunyan'

const LOG = bunyan.createLogger({
  name: 'http',
  level: 'debug',
})

function logHandler(req: Request, res: Response, next: NextFunction) {
  LOG.debug(`${req.method}: ${req.url}`)
  next()
  return
}

export default logHandler
