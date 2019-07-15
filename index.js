import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'

import routes from './routes'

const port = 3000
const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.set('views', './views')
app.set('view engine', 'pug')

routes(app)

app.all('*', (req, res) => {
  console.log('# 💢 Not Found!')
  res.status(404).send({ message: 'Request not found.' })
})

app.listen(port, () => console.log(`# 🎧 App listening on port ${port}!`))

export default app
