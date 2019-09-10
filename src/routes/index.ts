
import { get } from '../helpers/manifest'
import handleError from '../helpers/error'
/* eslint-disable no-unused-vars */
import { Express } from 'express-serve-static-core'
import { ViewModel } from '../classes/ViewModel'
import { Request, Response } from 'express'
/* eslint-enable no-unused-vars */

const handleurl = async (directions: Array<string>, res: Response) => {
  try {
    const tempdata = await get(directions)
    const data = tempdata.reduce(
      (acc, cur) => {
        const lista = [...acc.js || []]
        if (cur.isbundled) {
          lista.push(cur.bundlejs)
        }
        lista.push(cur.singlejs)
        const result = {
          js: [...lista],
          css: cur.css,
          iscss: cur.iscss
        }
        return result
      }, new ViewModel())
    const html = tempdata.filter(one => one.html)
    if (html && html.length) {
      data['html'] = html[0].html
      data['ishtml'] = true
    }
    res.render('index', data)
  } catch (ex) {
    handleError(ex)
    res.render('index', { ...new ViewModel(), js: [] })
  }
}

const handle = (app: Express) => {
  app.get('/app/:module/:page?/:sub?', async (req: Request, res: Response) => {
    const directions = Object.keys(req.params)
      .map(key => req.params[key])
      .filter(key => key && key !== 'undefined')
    await handleurl([...directions], res)
  })
}
export default handle
