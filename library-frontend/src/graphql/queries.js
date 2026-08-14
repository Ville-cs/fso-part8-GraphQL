import { gql } from '@apollo/client'
import { BooksDetails, UserDetails } from './fragments'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query AllBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      ...BooksDetails
    }
  }
  ${BooksDetails}
`

export const ME = gql`
  query {
    me {
      ...UserDetails
    }
  }
  ${UserDetails}
`

export const ME_AND_BOOKS = gql`
  query AllBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      ...BooksDetails
    }
    me {
      ...UserDetails
    }
  }
  ${BooksDetails}
  ${UserDetails}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BooksDetails
    }
  }
  ${BooksDetails}
`
