import axios from 'axios'
import handleError from './error'
import cheerio from 'cheerio'

const loadManifest = name =>
  new Promise((resolve, reject) => {
    axios.get(
      `${name}/manifest.json`
    ).then(result => {
      resolve({ result, name })
    }).catch(
      _ex_ => {
        console.log('consulta manifest 📨')
        console.log(`${name}/manifest.json`)
        reject(_ex_)
      })
  })

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
        obj['iscss'] = true
        obj['css'] = endpoint + '/' + main[elem]
        break
      case 'main.js':
        obj['js'] = endpoint + '/' + main[elem]
        break
    }
  })
  return new Promise((resolve, reject) => {
    if (main['index.html']) {
      axios
        .get(endpoint + '/' + main['index.html'])
        .then(result => {
          const $ = cheerio.load(result.data)
          const mainhtml = $('#import-me').html()
          obj['html'] = mainhtml
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
  const name = arr.reduce(
    (prev, current) => `${prev}/${current}`, ''
  )
  if (!name && name !== 'undefined') {
    return
  }
  return new Promise((resolve, reject) => {
    Promise.all([
      loadManifest(name),
      loadManifest('/navbar')
    ]).then(
      manifests => {
        Promise.all(
          manifests.map(
            m => handleManifest(m.name, m.result)
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
