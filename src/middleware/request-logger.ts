/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express'
/* eslint-enable no-unused-vars */

const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.info(`${req.method} ${req.originalUrl}`)
  const start = new Date().getTime()
  res.on('finish', () => {
    const elapsed = new Date().getTime() - start
    const msg = `${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed}ms`
    console.info(msg)
  })
  next()
}
export { requestLoggerMiddleware }
