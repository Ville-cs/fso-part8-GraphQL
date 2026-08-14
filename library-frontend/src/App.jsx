import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommended from './components/Recommended'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'
import { ALL_BOOKS, ME, BOOK_ADDED } from './graphql/queries'
import { useQuery, useSubscription } from '@apollo/client'

const App = () => {
  const [token, setToken] = useState(null)
  const [books, setBooks] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const client = useApolloClient()
  const navigate = useNavigate()
  const { data: booksData } = useQuery(ALL_BOOKS)
  const { data: userData, refetch } = useQuery(ME)

  useEffect(() => {
    const userToken = window.localStorage.getItem('library-user-token')
    if (userToken) {
      setToken(userToken)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [token])

  useEffect(() => {
    if (booksData) {
      setBooks(booksData.allBooks)
    }
    if (userData) {
      setUserDetails(userData.me)
    }
  }, [booksData, userData])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        }
      })
    },
  })

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
    navigate('/')
  }

  return (
    <div>
      <div>
        <Link to="/">
          <button>authors</button>
        </Link>
        <Link to="/books">
          <button>books</button>
        </Link>
        {token && (
          <Link to="/newbook">
            <button>add book</button>
          </Link>
        )}
        {token && (
          <Link to="/recommended">
            <button>recommended</button>
          </Link>
        )}
        {!token ? (
          <Link to="/login">
            <button>login</button>
          </Link>
        ) : (
          <button onClick={handleLogout}>logout</button>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Authors />} />
        <Route
          path="/books"
          element={<Books books={books} setBooks={setBooks} />}
        />
        <Route
          path="/newbook"
          element={!token ? <Login setToken={setToken} /> : <NewBook />}
        />
        <Route
          path="login"
          element={
            !token ? <Login setToken={setToken} /> : <Navigate replace to="/" />
          }
        />
        <Route
          path="/recommended"
          element={
            token ? (
              <Recommended books={books} userDetails={userDetails} />
            ) : (
              <Navigate replace to="/" />
            )
          }
        />
      </Routes>
    </div>
  )
}

export default App
