import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls event handler with right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText(/title/i), 'New Blog Title')
  await user.type(screen.getByLabelText(/author/i), 'New Author')
  await user.type(screen.getByLabelText(/url/i), 'http://example.com')

  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'New Blog Title',
    author: 'New Author',
    url: 'http://example.com',
  })
})
