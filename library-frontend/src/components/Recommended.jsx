import { ALL_BOOKS } from "../graphql/queries";
import { useQuery } from "@apollo/client";

const Recommended = ({ userDetails }) => {
  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre: userDetails?.favoriteGenre },
  });

  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>`Error! ${error.message}`</div>;
  }

  const books = data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <table>
        <tbody>
          <tr>
            <th>Books in your favorite genre:</th>
            <th>{userDetails && userDetails.favoriteGenre}</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books &&
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
