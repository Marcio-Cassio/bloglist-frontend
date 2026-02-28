import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getConfig = () => (
  token ? { headers: { Authorization: token } } : {}
)

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getConfig())
  return response.data
}

export default { getAll, create, setToken }