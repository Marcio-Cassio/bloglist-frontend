import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) return null

  const { message, type } = notification

  const style = {
    border: '2px solid',
    padding: 10,
    marginBottom: 10,
    color: type === 'success' ? 'green' : 'red',
    borderColor: type === 'success' ? 'green' : 'red',
  }

  return <div style={style}>{message}</div>
}

export default Notification