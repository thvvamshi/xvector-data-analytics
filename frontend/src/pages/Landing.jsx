import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing">
      <nav className="navbar">
        <h2>XVector Data Analytics</h2>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      <section className="hero">
        <h1>Analyze Your CSV Data with Ease</h1>

        <p>
          XVector Data Analytics is a full-stack web application that allows you
          to securely upload CSV datasets, preview data, compute statistics, and
          generate interactive visualizations using Apache ECharts.
        </p>

        <div className="actions">
          <Link to="/login">
            <button>Get Started</button>
          </Link>

          <Link to="/register">
            <button>Create Account</button>
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Key Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🔐 Secure Authentication</h3>
            <p>
              Register and log in securely using JWT-based authentication with
              encrypted passwords.
            </p>
          </div>

          <div className="feature-card">
            <h3>📂 CSV Dataset Management</h3>
            <p>
              Upload datasets, assign custom names, browse your uploads, preview
              data, and delete datasets whenever needed.
            </p>
          </div>

          <div className="feature-card">
            <h3>📊 Data Analytics</h3>
            <p>
              Compute useful statistics such as minimum, maximum, and sum on
              numeric columns.
            </p>
          </div>

          <div className="feature-card">
            <h3>📈 Interactive Charts</h3>
            <p>
              Visualize your datasets using scatter, line, and bar charts powered
              by Apache ECharts.
            </p>
          </div>
        </div>
      </section>

      <section className="workflow">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <h3>1</h3>
            <p>Create an account or log in.</p>
          </div>

          <div className="step">
            <h3>2</h3>
            <p>Upload your CSV dataset.</p>
          </div>

          <div className="step">
            <h3>3</h3>
            <p>Preview and analyze your data.</p>
          </div>

          <div className="step">
            <h3>4</h3>
            <p>Generate interactive visualizations.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 XVector Data Analytics. Built with React, FastAPI, PostgreSQL, and Apache ECharts.</p>
      </footer>
    </div>
  );
}

export default Landing;