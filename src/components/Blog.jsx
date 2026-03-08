import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

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
    <div style={blogStyle} data-testid="blog-item">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleDetails}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>

      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>

          {canRemove && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog