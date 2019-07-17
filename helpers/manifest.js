import axios from 'axios'
import handleError from './error'

const loadManifest = name => axios.get(`${name}/manifest.json`)
const handleManifest = (endpoint, { data: manifest }) => {
  const obj = {}
  const main = manifest.files
  Object.keys(main).forEach(elem => {
    switch (elem) {
      case 'main.css':
        obj['css'] = endpoint + main[elem]
        break
      case 'main.js':
        obj['js'] = endpoint + main[elem]
        break
      case 'index.html':
        obj['html'] = endpoint + main[elem]
        break
    }
  })
  return obj
}
export const get = arr => {
  const name = arr.reduce((prev, current) => `${prev}/${current}`, '')
  return new Promise((resolve, reject) => {
    loadManifest(name)
      .then(manifest => resolve(handleManifest(name, manifest)))
      .catch(ex => {
        handleError(ex)
        reject(ex)
      })
  })
}
