import "./DashboardCard.css";

function DashboardCard({ book }) {
  return (
    <div className="dashboard-card">
      <img
        className="dashboard-card-cover"
        src={book.coverImage}
        alt={book.title}
      />

      <div className="dashboard-card-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>Status: {book.status}</p>
        {book.rating && <p>Rating: {book.rating}/5</p>}
      </div>
    </div>
  );
}

export default DashboardCard;