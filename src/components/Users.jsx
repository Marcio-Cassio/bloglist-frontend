import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import userService from '../services/users'

const Users = () => {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (usersQuery.isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 text-sm text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        loading users...
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

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <p className="text-sm font-medium text-slate-500">Directory</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Users
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          A simple overview of authors and how many blog posts each one has
          created.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-left">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                user
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                blogs created
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-100 last:border-b-0"
              >
                <td className="px-6 py-5">
                  <Link
                    to={`/users/${user.id}`}
                    className="text-sm font-semibold text-slate-950 transition hover:text-slate-600"
                  >
                    {user.name}
                  </Link>
                </td>

                <td className="px-6 py-5">
                  <span className="inline-flex min-w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-800">
                    {user.blogs.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Users