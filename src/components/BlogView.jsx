import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import blogService from '../services/blogs'

const BlogView = () => {
  const { id } = useParams()
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ id, commentObject }) =>
      blogService.addComment(id, commentObject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  if (blogsQuery.isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 text-sm text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        loading blog...
      </div>
    )
  }

  if (blogsQuery.isError) {
    return (
      <div className="rounded-[1.75rem] border border-red-200 bg-white/90 p-6 text-sm text-red-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        blog service not available due to problems in server
      </div>
    )
  }

  const blogs = Array.isArray(blogsQuery.data) ? blogsQuery.data : []
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return (
      <div className="rounded-[1.75rem] border border-red-200 bg-white/90 p-6 text-sm text-red-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        blog not found
      </div>
    )
  }

  const comments = Array.isArray(blog.comments) ? blog.comments : []

  const handleAddComment = async (event) => {
    event.preventDefault()

    if (!comment.trim()) return

    await addCommentMutation.mutateAsync({
      id: blog.id,
      commentObject: { comment },
    })

    setComment('')
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <p className="text-sm font-medium text-slate-500">Blog detail</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {blog.title}
        </h1>

        <p className="mt-2 text-base text-slate-500">{blog.author}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              link
            </p>
            <a
              href={blog.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-all text-sm font-medium text-slate-900 transition hover:text-slate-700"
            >
              {blog.url}
            </a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              likes
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {blog.likes ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              added by
            </p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {blog.user?.name ?? 'unknown'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Discussion</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Comments
            </h2>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            {comments.length} comment{comments.length === 1 ? '' : 's'}
          </div>
        </div>

        <form onSubmit={handleAddComment} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            placeholder="Write a comment"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
          />
          <button
            type="submit"
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            add comment
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            No comments yet. Start the conversation.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {comments.map((comment, index) => (
              <li
                key={`${comment}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-800"
              >
                {comment}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default BlogView