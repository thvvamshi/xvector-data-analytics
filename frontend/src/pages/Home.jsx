import { Link } from "react-router-dom";

function Home() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <div className="home">
      <nav className="home-navbar">
        <h2>XVector Data Analytics</h2>

        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/data">Data</Link>
          <Link to="/analytics">Analytics</Link>

          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <section className="home-hero">
        <h1>Welcome Back 👋</h1>

        <p>
          Manage your datasets, perform statistical analysis, and create
          interactive visualizations from your CSV files.
        </p>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📂 Data Management</h3>

          <p>
            Upload CSV datasets, browse all uploaded datasets, preview the first
            25 rows, and delete datasets you no longer need.
          </p>

          <Link to="/data">
            <button>Go to Data</button>
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>📊 Analytics & Visualization</h3>

          <p>
            Compute minimum, maximum, and sum for numeric columns and generate
            interactive Scatter, Line, and Bar charts using Apache ECharts.
          </p>

          <Link to="/analytics">
            <button>Go to Analytics</button>
          </Link>
        </div>
      </section>

      <section className="overview">
        <h2>Application Workflow</h2>

        <div className="workflow">
          <div className="workflow-item">
            <span>1</span>
            <p>Upload a CSV dataset.</p>
          </div>

          <div className="workflow-item">
            <span>2</span>
            <p>Preview and manage your data.</p>
          </div>

          <div className="workflow-item">
            <span>3</span>
            <p>Compute statistics.</p>
          </div>

          <div className="workflow-item">
            <span>4</span>
            <p>Visualize data with charts.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;