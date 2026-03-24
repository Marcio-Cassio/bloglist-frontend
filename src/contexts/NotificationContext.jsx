import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

let notificationTimeoutId = null

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationContext = useContext(NotificationContext)
  return notificationContext[0]
}

export const useNotificationDispatch = () => {
  const notificationContext = useContext(NotificationContext)
  return notificationContext[1]
}

export const setNotification = (
  dispatch,
  message,
  type = 'success',
  seconds = 5
) => {
  dispatch({
    type: 'SHOW_NOTIFICATION',
    payload: { message, type },
  })

  clearTimeout(notificationTimeoutId)

  notificationTimeoutId = setTimeout(() => {
    dispatch({ type: 'CLEAR_NOTIFICATION' })
  }, seconds * 1000)
}