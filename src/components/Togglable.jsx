import { useImperativeHandle, useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div className="space-y-4">
      <div style={hideWhenVisible}>
        <button
          onClick={toggleVisibility}
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          {props.buttonLabel}
        </button>
      </div>

      <div style={showWhenVisible} className="space-y-4">
        {props.children}

        <div className="flex justify-end">
          <button
            onClick={toggleVisibility}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Togglable