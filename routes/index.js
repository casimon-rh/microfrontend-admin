import { get } from '../helpers/manifest'
import handleError from '../helpers/error'

const handle = app => {
  app.get('/app/:module/:page?/:sub?', (req, res) => {
    const directions = Object.keys(req.params).map(k => req.params[k]).filter(Boolean)
    console.log(directions)
    get([...directions])
      .then(data => res.render('index', data))
      .catch(ex => handleError(ex))
  })
}
export default handle
