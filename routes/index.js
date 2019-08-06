import { get } from '../helpers/manifest'
import handleError from '../helpers/error'

const handle = app => {
  app.get('/app/:module/:page?/:sub?', (req, res) => {
    const directions = Object.keys(req.params)
      .map(k => req.params[k])
      .filter(j => j && j !== 'undefined')
    get([...directions])
      .then(data => {
        console.log({ data })
        res.render('index', data)
      })
      .catch(ex => handleError(ex))
  })
}
export default handle
