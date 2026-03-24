import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getConfig = () => (token ? { headers: { Authorization: token } } : {})

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getConfig())
  return response.data
}

const update = async (id, updatedObject) => {
  const response = await axios.put(
    `${baseUrl}/${id}`,
    updatedObject,
    getConfig(),
  )
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

const addComment = async (id, commentObject) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, commentObject)
  return response.data
}

export default { getAll, create, update, remove, addComment, setToken }
