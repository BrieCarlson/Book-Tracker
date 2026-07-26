import StatCard from "../components/StatCard";
import "./Stats.css";

function Stats({ books }) {
  const totalBooks = books.length;

  const finishedBooks = books.filter(
    (book) => book.status === "Finished"
  ).length;

  const readingBooks = books.filter(
    (book) => book.status === "Reading"
  ).length;

  const wantToReadBooks = books.filter(
    (book) => book.status === "Want To Read"
  ).length;

  const didNotFinishBooks = books.filter(
    (book) => book.status === "Did Not Finish"
  ).length;

  const ratedBooks = books.filter(
    (book) => book.rating > 0
  );

  const averageRating =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce(
            (total, book) => total + book.rating,
            0
          ) / ratedBooks.length
        ).toFixed(2)
      : "N/A";

  return (
    <div className="stats-page">
      <h1>Reading Statistics</h1>

      <div className="stats-grid">
        <StatCard
            title="Total Books"
            value={totalBooks}
        />
        <StatCard
            title="Finished"
            value={finishedBooks}
        />
        <StatCard
            title="Reading"
            value={readingBooks}
        />
        <StatCard
            title="Want To Read"
            value={wantToReadBooks}
        />
        <StatCard
            title="Did Not Finish"
            value={didNotFinishBooks}
        />
        <StatCard
            title="Average Rating"
            value={`${averageRating} / 5`}
        />
        </div>
    </div>
  );
}

export default Stats;