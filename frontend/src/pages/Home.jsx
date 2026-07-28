import "./Home.css";

function Home({ books }) {
  // Library
  const totalBooks = books.length;

  // Current book being read (most recently added)
  const currentlyReading = books
    .filter((book) => book.status === "Reading")
    .sort(
      (a, b) =>
        new Date(b.dateAdded || 0) -
        new Date(a.dateAdded || 0)
    )[0];

  // Three oldest books waiting to be read
  const readNext = books
    .filter((book) => book.status === "Want To Read")
    .sort(
      (a, b) =>
        new Date(a.dateAdded || 0) -
        new Date(b.dateAdded || 0)
    )
    .slice(0, 3);

  // Three most recently finished books
  const recentlyFinished = books
    .filter((book) => book.dateFinished)
    .sort(
      (a, b) =>
        new Date(b.dateFinished) -
        new Date(a.dateFinished)
    )
    .slice(0, 3);

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Welcome Back!</h1>
        <p>{totalBooks} books in your library.</p>
      </div>

      <section className="dashboard-section">
        <h2>Currently Reading</h2>

        {currentlyReading ? (
          <div className="dashboard-book">
            {currentlyReading.coverImage && (
              <img
                src={currentlyReading.coverImage}
                alt={currentlyReading.title}
                className="dashboard-cover"
              />
            )}

            <h3>{currentlyReading.title}</h3>
            <p>{currentlyReading.author}</p>
          </div>
        ) : (
          <p>No books are currently being read.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Read Next</h2>

        <div className="dashboard-book-grid">
          {readNext.length > 0 ? (
            readNext.map((book) => (
              <div key={book.id} className="dashboard-book">
                {book.coverImage && (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="dashboard-cover"
                  />
                )}

                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>
            ))
          ) : (
            <p>Your reading list is empty.</p>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recently Finished</h2>

        <div className="dashboard-book-grid">
          {recentlyFinished.length > 0 ? (
            recentlyFinished.map((book) => (
              <div key={book.id} className="dashboard-book">
                {book.coverImage && (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="dashboard-cover"
                  />
                )}

                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </div>
            ))
          ) : (
            <p>No books have been finished yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;