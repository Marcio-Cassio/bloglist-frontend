import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import userService from '../services/users'


const User = () => {
  const { id } = useParams()

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (usersQuery.isLoading) {
    return <div>loading user...</div>
  }

  if (usersQuery.isError) {
    return <div>user service not available due to problems in server</div>
  }

  const users = Array.isArray(usersQuery.data) ? usersQuery.data : []
  const user = users.find((u) => u.id === id)

  if (!user) {
    return <div>user not found</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>

      <h3>added blogs</h3>

      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id ?? blog.title}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User