import axios from 'axios'
import handleError from './error'
import cheerio from 'cheerio'
/* eslint-disable no-unused-vars */
import { ManifestResult } from '../classes/ManifestResult'
/* eslint-enable no-unused-vars */
import { ViewModel } from '../classes/ViewModel'
import { modules } from '../routes/shared'

const loadManifest = (name: string): Promise<ManifestResult> =>
  new Promise((resolve, reject) => {
    axios.get(
      `${name}/manifest.json`
    ).then((result: any) => {
      resolve({ result, name })
    }).catch(
      exception => {
        reject(exception)
      })
  })

const handleManifest = (endpoint: string, { data: manifest }): Promise<ViewModel> => {
  const obj = new ViewModel()
  let main = {}
  if (!manifest.files) {
    main = manifest
  } else {
    main = manifest.files
  }
  Object.keys(main).forEach(elem => {
    switch (elem) {
      case 'main.css':
        obj.iscss = true
        obj.css = main[elem]
        break
      case 'main.js':
        obj.singlejs = main[elem]
        break
      case 'vendors~main.js':
        obj.isbundled = true
        obj.bundlejs = main[elem]
        break
    }
  })
  return new Promise((resolve, reject) => {
    const htmlkey = Object.keys(main).filter(h => h.includes('html'))[0]
    if (htmlkey && main[htmlkey]) {
      axios
        .get(main[htmlkey])
        .then(result => {
          const $ = cheerio.load(result.data)
          const mainhtml = $('#import-me').html()
          obj.html = mainhtml
          obj.ishtml = true
          resolve(obj)
        })
        .catch(error => {
          reject(error)
        })
    } else {
      obj.html = ''
      obj.ishtml = false
      resolve(obj)
    }
  })
}
export const get = (arr: Array<string>): Promise<Array<ViewModel>> => {
  const name = arr.reduce(
    (prev, current) => `${prev}/${current}`, ''
  )
  if (!name && name !== 'undefined') {
    return
  }
  return new Promise((resolve, reject) => {
    Promise.all([
      loadManifest(name),
      ...modules.map((mod) => loadManifest(mod))
    ]).then(
      (manifests: Array<ManifestResult>) => {
        Promise.all(
          manifests.map(
            (m: ManifestResult) => handleManifest(m.name, m.result)
          ))
          .then(result => resolve(result))
          .catch(_ex => reject(_ex))
      }
    ).catch(ex => {
      handleError(ex)
      reject(ex)
    })
  })
}
