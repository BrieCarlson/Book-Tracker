import { useAuth } from "../hooks/useAuth";
import Home from "../pages/Home";
import Landing from "../pages/Landing";

function HomeRoute({ books }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Home books={books} />;
  }

  return <Landing />;
}

export default HomeRoute;