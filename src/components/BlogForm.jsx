import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500">New entry</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Create new blog
        </h2>
      </div>

      <form onSubmit={addBlog} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-slate-700">
            title
          </label>
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="author" className="text-sm font-medium text-slate-700">
            author
          </label>
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-slate-700">
            url
          </label>
          <input
            id="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            create
          </button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm