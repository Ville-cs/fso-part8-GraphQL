import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../graphql/mutations'
import { useNavigate } from 'react-router-dom'

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, result] = useMutation(LOGIN, {
    onCompleted: () => {
      setUsername('')
      setPassword('')
      navigate('/')
    },
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [result.data])

  const submit = event => {
    event.preventDefault()
    login({ variables: { username, password } })
  }
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login
