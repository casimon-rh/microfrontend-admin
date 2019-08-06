import axios from 'axios'
import handleError from './error'
import cheerio from 'cheerio'

const loadManifest = name => axios.get(`${name}/manifest.json`)
const handleManifest = (endpoint, { data: manifest }) => {
  const obj = {}
  let main = {}
  if (!manifest.files) {
    main = manifest
  } else {
    main = manifest.files
  }
  Object.keys(main).forEach(elem => {
    switch (elem) {
      case 'main.css':
        obj['css'] = endpoint + main[elem]
        break
      case 'main.js':
        obj['js'] = endpoint + main[elem]
        break
    }
  })
  return new Promise((resolve, reject) => {
    if (main['index.html']) {
      axios
        .get(endpoint + main['index.html'])
        .then(result => {
          const $ = cheerio.load(result.data)
          obj['html'] = $('#import-me').html()
          obj['ishtml'] = true
          resolve(obj)
        })
        .catch(_ex => {
          console.log('consulta 📨')
          console.log(endpoint + main['index.html'])
          reject(_ex)
        })
    } else {
      obj['html'] = ''
      obj['ishtml'] = false
      resolve(obj)
    }
  })
}
export const get = arr => {
  const name = arr.reduce((prev, current) => `${prev}/${current}`, '')
  const endpoint = '/' + arr[0] + '/'
  return new Promise((resolve, reject) => {
    loadManifest(name)
      .then(manifest => resolve(handleManifest(endpoint, manifest)))
      .catch(ex => {
        handleError(ex)
        reject(ex)
      })
  })
}
