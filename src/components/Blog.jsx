import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const canRemove =
    blog.user &&
    typeof blog.user === 'object' &&
    blog.user.username &&
    user &&
    blog.user.username === user.username

  return (
    <article
      className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
      data-testid="blog-item"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <Link
            to={`/blogs/${blog.id}`}
            className="block text-lg font-semibold tracking-tight text-slate-950 transition hover:text-slate-700"
          >
            {blog.title}
          </Link>

          <p className="mt-1 text-sm text-slate-500">{blog.author}</p>
        </div>

        <button
          onClick={toggleDetails}
          className="w-fit rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950"
        >
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>

      {detailsVisible && (
        <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                link
              </p>
              <a
                href={blog.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block break-all text-sm font-medium text-slate-800 transition hover:text-slate-950"
              >
                {blog.url}
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                likes
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-lg font-semibold text-slate-950">
                  {blog.likes ?? 0}
                </span>
                <button
                  onClick={() => handleLike(blog)}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  like
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                added by
              </p>
              <p className="mt-2 text-sm font-medium text-slate-800">
                {blog.user?.name ?? 'unknown'}
              </p>
            </div>
          </div>

          {canRemove && (
            <div className="flex justify-end">
              <button
                onClick={() => handleRemove(blog)}
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100"
              >
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default Blog