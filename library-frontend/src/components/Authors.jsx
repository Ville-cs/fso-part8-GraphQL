import { useState } from 'react'
import { ALL_AUTHORS } from '../graphql/queries'
import { EDIT_AUTHOR } from '../graphql/mutations'
import { useQuery, useMutation } from '@apollo/client'

const Authors = () => {
  const [year, setYear] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: error => {
      console.log(error)
    },
  })
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div>loading</div>
  }

  const authors = result.data.allAuthors

  const setBornTo = Number(year)

  const submit = async event => {
    event.preventDefault()
    const form = event.target
    const formData = new FormData(form)
    const formJson = Object.fromEntries(formData.entries())
    const name = formJson.author
    editAuthor({ variables: { name, setBornTo } })
    setYear('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>set birthyear</h2>
      <div>
        <form onSubmit={submit}>
          <div>
            <select name="author">
              {authors.map(a => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            born
            <input
              type="number"
              value={year}
              onChange={({ target }) => setYear(target.value)}
            />
          </div>
          <button type="submit">update birthyear</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
