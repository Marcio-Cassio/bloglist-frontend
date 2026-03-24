import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) return null

  const { message, type } = notification

  const tone =
    type === 'success'
      ? 'border-emerald-200/80 bg-emerald-50/90 text-emerald-800'
      : 'border-red-200/80 bg-red-50/90 text-red-700'

  const accent = type === 'success' ? 'bg-emerald-500' : 'bg-red-500'

  return (
    <div
      className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm backdrop-blur ${tone}`}
    >
      <div className={`mt-1 h-2.5 w-2.5 rounded-full ${accent}`} />
      <p className="text-sm font-medium leading-6">{message}</p>
    </div>
  )
}

export default Notification