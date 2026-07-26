function Home({ books }) {
  const totalBooks = books.length;
  const wantToRead = books.filter(
    (book) => book.status === "Want To Read"
  ).length;
  const currentlyReading = books.filter(
    (book) => book.status === "Reading" 
  ).length;
  const finished = books.filter(
    (book) => book.status === "Finished" 
  ).length;
  const didNotFinish = books.filter(
    (book) => book.status === "Did Not Finish" 
  ).length;
  const ratedBooks = books.filter(
    (book) => book.rating > 0
  );

  // Calculates the average rating or returns "N/A" if empty.
  const averageRating = 
  ratedBooks.length > 0
  ? (
      ratedBooks.reduce(
        (total, book) => total + book.rating,
        0
      ) / ratedBooks.length
    ).toFixed(1)
    : "N/A";

  // Iterates through the books array to find and return the single book object with the highest rating.
  const highestRated = books.reduce((highest, current) => {
    if(!highest || current.rating > highest.rating) {
      return current;
    }
    return highest;
  }, null);

  // Finds the single book that was completed most recently by filtering out unfinished items and sorting the rest by date.
  const mostRecentlyFinished = books
    .filter((book) => book.dateFinished)
    .sort(
      (a, b) =>
        new Date(b.dateFinished) -
        new Date(a.dateFinished)
    )[0];

  return (
    <div>
      <h1>Reading Dashboard</h1>

      <h2>Library</h2>
      <p>Total Books: {totalBooks}</p>

      <h2>Reading Status</h2>
      <p>Want To Read: {wantToRead}</p>
      <p>Currently Reading: {currentlyReading}</p>
      <p>Finished: {finished}</p>
      <p>Did Not Finish: {didNotFinish}</p>

      <h2>Ratings</h2>
      <p>Average Rating: {averageRating}</p>
      <p>
        Highest Rated:{" "}
        {highestRated
          ? `${highestRated.title} (${highestRated.rating}/5)`
          : "N/A"}
      </p>

      <h2>Recently Finished</h2>
      <p>
        {mostRecentlyFinished
          ? mostRecentlyFinished.title
          : "No books finished yet"}
      </p>
    </div>
  );
}

export default Home;