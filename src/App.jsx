import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [notification, setNotification] = useState(null)
  const notificationTimeoutRef = useRef(null)
  const blogFormRef = useRef()

  const notify = (message, type = 'success') => {
    setNotification({ message, type })

    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null)
      notificationTimeoutRef.current = null
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')

      notify(`${user.name} logged in`, 'success')
    } catch (error) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    notify('logged out', 'success')
  }

  const createBlog = async (blogObject) => {
  try {
    const returnedBlog = await blogService.create(blogObject)

    const blogForState = {
      ...returnedBlog,
      user:
        typeof returnedBlog.user === 'string'
          ? { username: user.username, name: user.name, id: returnedBlog.user }
          : returnedBlog.user
    }

    blogFormRef.current?.toggleVisibility()
    setBlogs(prevBlogs => prevBlogs.concat(blogForState))
    notify(`a new blog ${blogForState.title} by ${blogForState.author} added`, 'success')
  } catch (error) {
    notify('failed to add blog', 'error')
  }
}

  const likeBlog = async (blog) => {
    const userId =
      typeof blog.user === 'object'
        ? (blog.user.id || blog.user._id)
        : blog.user

    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: userId,
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    const mergedBlog = {
      ...returnedBlog,
      user: returnedBlog.user?.name ? returnedBlog.user : blog.user
    }

    setBlogs(prevBlogs =>
      prevBlogs.map(b => (b.id === blog.id ? mergedBlog : b))
    )
  }

  const blogsToShow = [...blogs].sort((a, b) => b.likes - a.likes)

  const deleteBlog = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ok) return

    try {
      await blogService.remove(blog.id)
      setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== blog.id))
      notify(`removed ${blog.title}`, 'success')
    } catch (error) {
      notify('failed to remove blog', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />

        <h2>Log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
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
      <Notification notification={notification} />

      <h2>blogs</h2>
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {blogsToShow.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleLike={likeBlog}
          handleRemove={deleteBlog}
        />
      )}
    </div>
  )
}

export default App