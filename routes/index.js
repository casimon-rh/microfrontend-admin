import { get } from '../helpers/manifest'
import handleError from '../helpers/error'

const handle = app => {
  app.get('/app/:module/:page?/:sub?', (req, res) => {
    const directions = Object.keys(req.params)
      .map(k => req.params[k])
      .filter(j => j && j !== 'undefined')
    get([...directions])
      .then(tempdata => {
        const data = tempdata.reduce(
          (acc, cur) => {
            let lista = []
            const temp = { ...cur }
            if (!acc.js) {
              acc.js = []
            } else {
              lista = [...acc.js]
            }
            lista.push(temp.js)
            const text = temp.js
            console.log({ text, type: typeof (text), fun: text.includes })
            const b = text.includes('navbar')
            console.log({ b })
            return {
              js: [...lista],
              html: b ? acc.html : cur.html,
              ishtml: b ? acc.ishtml : cur.ishtml
            }
          }, {})
        console.log({ data })
        res.render('index', data)
      })
      .catch(ex => handleError(ex))
  })
}
export default handle
