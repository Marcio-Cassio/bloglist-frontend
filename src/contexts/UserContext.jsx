import { createContext, useContext, useReducer, useEffect } from 'react'
import blogService from '../services/blogs'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const storedUser = JSON.parse(loggedUserJSON)
      dispatch({ type: 'SET_USER', payload: storedUser })
      blogService.setToken(storedUser.token)
    }
  }, [])

  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const userContext = useContext(UserContext)
  return userContext[0]
}

export const useUserDispatch = () => {
  const userContext = useContext(UserContext)
  return userContext[1]
}

export const setUser = (dispatch, user) => {
  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
  blogService.setToken(user.token)
  dispatch({ type: 'SET_USER', payload: user })
}

export const clearUser = (dispatch) => {
  window.localStorage.removeItem('loggedBlogappUser')
  blogService.setToken(null)
  dispatch({ type: 'CLEAR_USER' })
}