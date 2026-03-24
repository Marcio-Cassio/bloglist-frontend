import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Routes, Route, Link } from 'react-router-dom'
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

      setNotification(notificationDispatch, `${loggedInUser.name} logged in`, 'success')
    } catch (error) {
      setNotification(notificationDispatch, 'wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    clearUser(userDispatch)
    setNotification(notificationDispatch, 'logged out', 'success')
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

  if (blogsQuery.isLoading) {
    return <div>loading blogs...</div>
  }

  if (blogsQuery.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  if (user === null) {
    return (
      <div>
        <Notification />

        <h2>Log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
  <div>
    <Notification />

    <div>
      <Link to="/">blogs</Link>{' '}
      <Link to="/users">users</Link>{' '}
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </div>

    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h2>blogs</h2>
            
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <BlogForm createBlog={createBlog} />
            </Togglable>

            {blogsToShow.map((blog) => (
              <Blog
                key={getBlogId(blog) ?? blog.url ?? `${blog.title}-${blog.author}`}
                blog={blog}
                user={user}
                handleLike={likeBlog}
                handleRemove={deleteBlog}
              />
            ))}
          </div>
        }
      />

      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<User />} />
      <Route path="/blogs/:id" element={<BlogView />} />
    </Routes>
  </div>
  )
}

export default App