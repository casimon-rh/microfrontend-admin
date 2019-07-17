import { get } from '../helpers/manifest'
import handleError from '../helpers/error'

const handle = app => {
  app.get('/app/tesoreria', (req, res) => {
    get(['tesoreria', 'transacciones'])
      .then(data => res.render('index', data))
      .catch(ex => handleError(ex))
  })
  app.get('/app/tesoreria/:pag', (req, res) => {
    get(['tesoreria', req.params.pag])
      .then(data => res.render('index', data))
      .catch(ex => handleError(ex))
  })
  app.get('/app/test', (req, res) => {
    get(['test'])
      .then(data => res.render('index', data))
      .catch(ex => handleError(ex))
  })
}
export default handle
