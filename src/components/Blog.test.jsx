import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

test('renders blog title and author', () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Marcio',
    url: 'http://example.com',
    likes: 7,
    user: { username: 'marcio', name: 'Marcio' },
  }

  render(
    <Blog
      blog={blog}
      user={blog.user}
      handleLike={() => {}}
      handleRemove={() => {}}
    />,
  )
})

test('renders url and likes only after clicking view', async () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Marcio',
    url: 'http://example.com',
    likes: 7,
    user: { username: 'marcio', name: 'Marcio' },
  }

  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
      user={blog.user}
      handleLike={() => {}}
      handleRemove={() => {}}
    />,
  )

  // hidden initially
  expect(screen.queryByText(/http:\/\/example\.com/)).toBeNull()
  expect(screen.queryByText(/likes/i)).toBeNull()

  // click view -> visible
  await user.click(screen.getByText(/view/i))

  expect(screen.getByText(/http:\/\/example\.com/)).toBeInTheDocument()
  expect(screen.getByText(/7/)).toBeInTheDocument()
})

test('clicking like twice calls event handler twice', async () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Marcio',
    url: 'http://example.com',
    likes: 7,
    user: { username: 'marcio', name: 'Marcio' },
  }

  const mockLikeHandler = vi.fn()
  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
      user={blog.user}
      handleLike={mockLikeHandler}
      handleRemove={() => {}}
    />,
  )

  // ensure like button is visible (if it appears only after "view")
  await user.click(screen.getByText(/view/i))

  const likeButton = screen.getByRole('button', { name: /like/i })
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})
