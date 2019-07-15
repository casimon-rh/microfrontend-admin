import axios from 'axios'
import handleError from './error'

const loadManifest = name => axios.get(`${name}manifest.json`)
const handleManifest = (endpoint, { data: manifest }) => {
  const obj = {}
  Object.keys(manifest).forEach(elem => {
    switch (elem) {
      case 'main.css':
        obj['css'] = endpoint + manifest[elem]
        break
      case 'main.js':
        obj['js'] = endpoint + manifest[elem]
        break
      case 'index.html':
        obj['html'] = endpoint + manifest[elem]
        break
      default:
        throw new Error('default')
    }
  })
  return obj
}
export const get = arr => {
  const name = arr.reduce((prev, current) => `${prev}/${current}`, '')
  return new Promise((resolve, reject) => {
    loadManifest(name)
      .then(resolve(handleManifest.bind(this, name)))
      .catch(reject(handleError))
  })
}
