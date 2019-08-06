import path from 'path'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import sass from 'node-sass-middleware'

import routes from './routes'

const port = 3000
const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.set('views', './views')
app.set('view engine', 'pug')
app.set('port', port)

app.use(sass({ src: path.join(__dirname, 'public', 'styles') }))
app.use(express.static(path.join(__dirname, 'public')))
routes(app)

app.all('*', (req, res) => {
  console.log('# 💢 Not Found!')
  res.status(404).send({ message: 'Request not found.' })
})

app.listen(port, () => console.log(`# 🎧 App listening on port ${port}!`))

export default app
