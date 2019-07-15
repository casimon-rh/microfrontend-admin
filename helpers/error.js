import safeStringify from 'fast-safe-stringify'
const handleError = error => console.error(`# 🚨 Err! \n${safeStringify(error)}`)
export default handleError
