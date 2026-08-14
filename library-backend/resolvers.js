const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const results = await Book.find({}).populate('author', {
        name: 1,
        born: 1,
        bookCount: 1,
      })
      if (args.author && args.genre) {
        return results.filter(
          book =>
            book.author.name === args.author && book.genres.includes(args.genre)
        )
      } else if (args.author) {
        return results.filter(book => book.author.name === args.author)
      } else if (args.genre) {
        return results.filter(book => book.genres.includes(args.genre))
      }
      return results
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const result = authors.map(author => {
        author.bookCount = author.books.length
        return author
      })
      return result
    },
  },
  Author: {
    bookCount: async root => {
      const author = await Author.findOne({ name: root.name })
      return author.books.length
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Login to add a book', {
          extensions: { code: 'NO_AUTHORIZATION' },
        })
      }
      try {
        const author = await Author.findOne({ name: args.author })
        const book = new Book({ ...args, author: author.id })
        author.books = author.books.concat(book)
        result = await book.save()
        await author.save()
        result.author = author
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error },
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: result })

      return result
    },
    addAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Login to add an author', {
          extensions: { code: 'NO_AUTHORIZATION' },
        })
      }
      try {
        const author = new Author({ ...args })
        if (!author.bookCount) {
          author.bookCount = 0
        }
        return author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args.name, error },
        })
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Login to edit an author', {
          extensions: { code: 'NO_AUTHORIZATION' },
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      const updatedAuthor = await Author.findByIdAndUpdate(author.id, author, {
        new: true,
      })
      return updatedAuthor
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      return user.save().catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED') },
  },
}

module.exports = resolvers
