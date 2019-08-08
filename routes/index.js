import { get } from '../helpers/manifest'
import handleError from '../helpers/error'

const handle = app => {
  app.get('/app/:module/:page?/:sub?', (req, res) => {
    const directions = Object.keys(req.params)
      .map(key => req.params[key])
      .filter(key => key && key !== 'undefined')
    get([...directions])
      .then(tempdata => {
        const data = tempdata.reduce(
          (acc, cur) => {
            const lista = [...acc.js || []]
            lista.push(cur.js)
            return {
              js: [...lista],
              html: cur.js.includes('navbar') ? acc.html : cur.html,
              ishtml: cur.js.includes('navbar') ? acc.ishtml : cur.ishtml
            }
          }, {})
        res.render('index', data)
      })
      .catch(ex => {
        handleError(ex)
        res.status(500).send({
          message: 'error interno'
        })
      })
  })
}
export default handle
