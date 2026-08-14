import { gql } from '@apollo/client'

export const BooksDetails = gql`
  fragment BooksDetails on Book {
    title
    published
    genres
    id
    author {
      name
      bookCount
      id
      born
    }
  }
`

export const UserDetails = gql`
  fragment UserDetails on User {
    username
    favoriteGenre
    id
  }
`
