import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import userService from '../services/users'

const User = () => {
  const { id } = useParams()

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (usersQuery.isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 text-sm text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        loading user...
      </div>
    )
  }

  if (usersQuery.isError) {
    return (
      <div className="rounded-[1.75rem] border border-red-200 bg-white/90 p-6 text-sm text-red-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        user service not available due to problems in server
      </div>
    )
  }

  const users = Array.isArray(usersQuery.data) ? usersQuery.data : []
  const user = users.find((u) => u.id === id)

  if (!user) {
    return (
      <div className="rounded-[1.75rem] border border-red-200 bg-white/90 p-6 text-sm text-red-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        user not found
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <p className="text-sm font-medium text-slate-500">Author profile</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {user.name}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          {user.blogs.length} blog{user.blogs.length === 1 ? '' : 's'} added
        </p>
      </div>

      <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          Added blogs
        </h2>

        {user.blogs.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No blogs added yet.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {user.blogs.map((blog) => (
              <li
                key={blog.id ?? blog.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-800 transition hover:border-slate-300 hover:bg-slate-100/70"
              >
                <Link
                  to={`/blogs/${blog.id}`}
                  className="font-medium text-slate-950 transition hover:text-slate-700"
                >
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default User