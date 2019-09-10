import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import sass from 'node-sass-middleware'
import { requestLoggerMiddleware } from './middleware/request-logger'
import routes from './routes'
/* eslint-disable no-unused-vars */
import express, { Request, Response } from 'express'
import { Express } from 'express-serve-static-core'
/* eslint-enable no-unused-vars */

const port = 3000
const app:Express = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.set('views', './views')
app.set('view engine', 'pug')
app.set('port', port)
app.use(requestLoggerMiddleware)
app.use(sass({
  src: __dirname,
  debug: true,
  indentedSyntax: true,
  outputStyle: 'compressed'
}))
app.use('/public', express.static(path.join(__dirname, 'public')))
routes(app)

app.all('*', (req: Request, res: Response) => {
  console.log('# 💢 Not Found!')
  res.status(404).send({ message: 'Request not found.' })
})

app.listen(port, () => {
  console.log(`# 🎧 App listening on port ${port}!`)
})

export default app
