import axios from 'axios'
import handleError from './error'
import safeStringify from 'fast-safe-stringify'
import cheerio from 'cheerio'

const loadManifest = name => axios.get(`${name}/manifest.json`)
const handleManifest = (endpoint, { data: manifest }) => {
  const obj = {}
  const main = manifest.files
  console.log(endpoint)
  console.log(safeStringify(manifest))
  Object.keys(main).forEach(elem => {
    switch (elem) {
      case 'main.css':
        obj['css'] = '/' + endpoint + main[elem]
        break
      case 'main.js':
        obj['js'] = '/' + endpoint + main[elem]
        break
    }
  })
  return new Promise((resolve, reject) => {
    if (main['index.html']) {
      axios
        .get('/' + endpoint + main['index.html'])
        .then(result => {
          const $ = cheerio.load(result.data)
          obj['html'] = $('#import-me').html()
          obj['ishtml'] = true
          resolve(obj)
        })
        .catch(ex => reject(ex))
    } else {
      obj['html'] = ''
      obj['ishtml'] = false
      resolve(obj)
    }
    console.log(safeStringify(obj))
  })
}
export const get = arr => {
  const name = arr.reduce((prev, current) => `${prev}/${current}`, '')
  console.log(name)
  return new Promise((resolve, reject) => {
    loadManifest(name)
      .then(manifest => resolve(handleManifest(arr[0], manifest)))
      .catch(ex => {
        handleError(ex)
        reject(ex)
      })
  })
}
