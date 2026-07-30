import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login");
  };

  return (
    <div className="home">
      <nav className="navbar">
        <h2>XVector Data Analytics</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/data">Data</Link>
          <Link to="/analytics">Analytics</Link>

          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <section className="hero">
        <h1>Welcome Back!</h1>

        <p>
          Upload CSV datasets, preview data, compute statistics, and visualize
          your data using interactive charts.
        </p>

        <div className="actions">
          <Link to="/data">
            <button>Manage Data</button>
          </Link>

          <Link to="/analytics">
            <button>Analytics</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
