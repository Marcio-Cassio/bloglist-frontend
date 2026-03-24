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
    mutationFn: ({ id, commentObject }) => blogService.addComment(id, commentObject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  if (blogsQuery.isLoading) {
    return <div>loading blog...</div>
  }

  if (blogsQuery.isError) {
    return <div>blog service not available due to problems in server</div>
  }

  const blogs = Array.isArray(blogsQuery.data) ? blogsQuery.data : []
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <div>blog not found</div>
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
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div>{blog.url}</div>
      <div>likes {blog.likes}</div>
      <div>added by {blog.user?.name}</div>

      <h3>comments</h3>

      <form onSubmit={handleAddComment}>
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>

      <ul>
        {comments.map((comment, index) => (
          <li key={`${comment}-${index}`}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView