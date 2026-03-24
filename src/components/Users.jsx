import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const Users = () => {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })

  if (usersQuery.isLoading) {
    return <div>loading users...</div>
  }

  if (usersQuery.isError) {
    return <div>user service not available due to problems in server</div>
  }

  const users = Array.isArray(usersQuery.data) ? usersQuery.data : []

  return (
    <div>
      <h2>users</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users