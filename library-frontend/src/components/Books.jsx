import { useState, useEffect } from 'react'
import { ALL_BOOKS } from '../graphql/queries'
import { useLazyQuery } from '@apollo/client'

const Books = ({ books, setBooks }) => {
  const [genres, setGenres] = useState([])
  const [getBooks, { data }] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    if (data) {
      setBooks(data.allBooks)
    }
  }, [data])

  if (books) {
    books.map(book => {
      book.genres.map(genre => {
        if (!genres.includes(genre)) {
          setGenres(genres.concat(genre))
        }
      })
    })
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books &&
            books.map(a => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {genres.map(genre => (
        <button
          key={genre}
          onClick={() => getBooks({ variables: { genre: genre } })}
        >
          {genre}
        </button>
      ))}
      <button onClick={() => getBooks()}>show all</button>
    </div>
  )
}

export default Books
