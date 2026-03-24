import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import {
  useNotificationDispatch,
  setNotification,
} from './contexts/NotificationContext'
import {
  useUserValue,
  useUserDispatch,
  setUser as setLoggedUser,
  clearUser,
} from './contexts/UserContext'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'

const App = () => {
  const user = useUserValue()
  const userDispatch = useUserDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const notificationDispatch = useNotificationDispatch()
  const blogFormRef = useRef()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  const getBlogId = (blog) => blog?.id ?? blog?._id

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({ username, password })

      setLoggedUser(userDispatch, loggedInUser)
      setUsername('')
      setPassword('')

      setNotification(
        notificationDispatch,
        `${loggedInUser.name} logged in`,
        'success'
      )

      navigate('/')
    } catch (error) {
      setNotification(notificationDispatch, 'wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    clearUser(userDispatch)
    setNotification(notificationDispatch, 'logged out', 'success')
    navigate('/login')
  }

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await createBlogMutation.mutateAsync(blogObject)
      blogFormRef.current?.toggleVisibility()

      setNotification(
        notificationDispatch,
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success'
      )
    } catch (error) {
      setNotification(notificationDispatch, 'failed to add blog', 'error')
    }
  }

  const likeBlog = async (blog) => {
    const id = getBlogId(blog)
    if (!id) return

    const userId =
      typeof blog.user === 'object'
        ? blog.user.id || blog.user._id
        : blog.user

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: (blog.likes ?? 0) + 1,
      user: userId,
    }

    try {
      await updateBlogMutation.mutateAsync({ id, updatedBlog })
    } catch (error) {
      setNotification(notificationDispatch, 'failed to update blog', 'error')
    }
  }

  const deleteBlog = async (blog) => {
    const id = getBlogId(blog)
    if (!id) return

    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return

    try {
      await deleteBlogMutation.mutateAsync(id)
      setNotification(notificationDispatch, `removed ${blog.title}`, 'success')
    } catch (error) {
      setNotification(notificationDispatch, 'failed to remove blog', 'error')
    }
  }

  const blogs = Array.isArray(blogsQuery.data)
    ? blogsQuery.data.filter(Boolean)
    : []

  const blogsToShow = blogs
    .slice()
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))

  const navLinkClass = ({ isActive }) =>
    [
      'rounded-full px-4 py-2 text-sm font-medium transition',
      isActive
        ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200'
        : 'text-slate-600 hover:bg-white/70 hover:text-slate-950',
    ].join(' ')

  const isLoginPage = !user && location.pathname === '/login'

  return (
    <div className="min-h-screen">
      {!isLoginPage && (
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold tracking-tight text-white shadow-sm">
                bloglist
              </div>

              <nav className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-100/80 p-1">
                <NavLink to="/" className={navLinkClass}>
                  blogs
                </NavLink>
                <NavLink to="/users" className={navLinkClass}>
                  users
                </NavLink>
              </nav>
            </div>

            {user ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
                  <span className="font-medium text-slate-900">{user.name}</span>{' '}
                  logged in
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                >
                  logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
                  public view
                </div>

                <Link
                  to="/login"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                >
                  login
                </Link>
              </div>
            )}
          </div>
        </header>
      )}

      <main
        className={
          isLoginPage
            ? 'min-h-screen px-6 py-10'
            : 'mx-auto max-w-6xl px-6 py-8 sm:py-10'
        }
      >
        <Notification />

        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
                  <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="flex flex-col justify-center">
                      <span className="mb-4 inline-flex w-fit rounded-full border border-white/70 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm backdrop-blur">
                        bloglist
                      </span>

                      <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                        Clean writing, simple publishing, polished interface.
                      </h1>

                      <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                        A minimal blog dashboard with a calm, premium feel. Sign
                        in to manage posts, or continue as a guest to browse the
                        content freely.
                      </p>
                    </div>

                    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
                      <div className="mb-8">
                        <p className="text-sm font-medium text-slate-500">
                          Welcome back
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                          Log in to application
                        </h2>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                          <label
                            htmlFor="username"
                            className="text-sm font-medium text-slate-700"
                          >
                            username
                          </label>
                          <input
                            id="username"
                            type="text"
                            value={username}
                            name="Username"
                            onChange={({ target }) => setUsername(target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="password"
                            className="text-sm font-medium text-slate-700"
                          >
                            password
                          </label>
                          <input
                            id="password"
                            type="password"
                            value={password}
                            name="Password"
                            onChange={({ target }) => setPassword(target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
                          />
                        </div>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                          <button
                            type="submit"
                            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                          >
                            login
                          </button>

                          <Link
                            to="/"
                            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                          >
                            continue as guest
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )
            }
          />

          <Route
            path="/"
            element={
              <div className="space-y-8">
                <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Dashboard
                      </p>
                      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                        Blogs
                      </h1>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                        Browse the latest posts, keep the best writing on top,
                        and manage entries from one calm, focused workspace.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:w-fit">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                          total blogs
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">
                          {blogsQuery.isSuccess ? blogsToShow.length : '—'}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                          top likes
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-slate-950">
                          {blogsQuery.isSuccess ? blogsToShow[0]?.likes ?? 0 : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {user ? (
                  <section className="space-y-6">
                    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                      <BlogForm createBlog={createBlog} />
                    </Togglable>
                  </section>
                ) : (
                  <section className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Public browsing
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                          Explore first, sign in when you want to publish
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          This project is fully viewable without logging in.
                        </p>
                      </div>

                      <Link
                        to="/login"
                        className="rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                      >
                        go to login
                      </Link>
                    </div>
                  </section>
                )}

                {blogsQuery.isLoading ? (
                  <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 text-sm text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                    loading blogs...
                  </div>
                ) : blogsQuery.isError ? (
                  <div className="rounded-[1.75rem] border border-red-200 bg-white/90 p-6 text-sm text-red-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                    blog service not available due to problems in server
                  </div>
                ) : (
                  <section className="space-y-4">
                    {blogsToShow.map((blog) => (
                      <Blog
                        key={getBlogId(blog) ?? blog.url ?? `${blog.title}-${blog.author}`}
                        blog={blog}
                        user={user}
                        handleLike={likeBlog}
                        handleRemove={deleteBlog}
                      />
                    ))}
                  </section>
                )}
              </div>
            }
          />

          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </main>
    </div>
  )
}

export default App