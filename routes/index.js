import { get } from '../helpers/manifest'
const handle = app => {
  app.get('/tesoreria', (req, res) => {
    get(['tesoreria', 'transacciones']).then(data => res.render('index', data))
  })
  app.get('/tesoreria/:pag', (req, res) => {
    get(['tesoreria', req.params.pag]).then(data => res.render('index', data))
  })
  app.get('/test', (req, res) => {
    get(['test']).then(data => res.render('index', data))
  })
}
export default handle
