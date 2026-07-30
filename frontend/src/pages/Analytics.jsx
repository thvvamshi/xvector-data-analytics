import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import api from "../services/api";

function Analytics() {
  const navigate = useNavigate();

  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState("");
  const [columns, setColumns] = useState([]);

  // Stats state
  const [statColumn, setStatColumn] = useState("");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Plot state
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");
  const [loadingPlot, setLoadingPlot] = useState(false);
  const [hasPlot, setHasPlot] = useState(false);

  const [error, setError] = useState("");

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

const fetchDatasets = async () => {
  try {
    setError("");

    const res = await api.get("/dataset");

    setDatasets(res.data.items || []);
  } catch (err) {
    console.error(err);
    setDatasets([]);
    setError("Failed to load datasets.");
  }
};

  const handleDatasetChange = (datasetId) => {
    setSelectedDatasetId(datasetId);

    setStats(null);
    setStatColumn("");

    setXColumn("");
    setYColumn("");
    setHasPlot(false);

    setColumns([]);

    chartInstance.current?.dispose();
    chartInstance.current = null;

    const selected = datasets.find((d) => d.id === datasetId);
    setColumns(selected?.columns || []);
  };

  const fetchStats = async (column) => {
    if (!selectedDatasetId || !column) return;

    try {
      setLoadingStats(true);
      setStats(null);
      setError("");

      const res = await api.get(`/dataset/${selectedDatasetId}/stats`, {
        params: { column },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setStats(null);
      setError(err.response?.data?.detail || "Failed to load column statistics.");
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAndRenderPlot = async (x, y) => {
    if (!selectedDatasetId || !x || !y) return;

    try {
      setLoadingPlot(true);
      setError("");
      
      chartInstance.current?.clear();

      const res = await api.get(`/dataset/${selectedDatasetId}/plot`, {
        params: { x, y },
      });

      const rawData = res.data.data || [];

      if (rawData.length === 0) {
        chartInstance.current?.clear();
        setHasPlot(false);
        setError("No plottable data found for the selected columns.");
        return;
      }

      if (!chartRef.current) return;

      // Container is guaranteed visible in DOM, ensuring non-zero width/height dimensions
      chartInstance.current =
        echarts.getInstanceByDom(chartRef.current) ||
        echarts.init(chartRef.current);

      const xValues = rawData.map((point) => point[0]);
      const yValues = rawData.map((point) => point[1]);

      const option = {
        title: {
          text: `${res.data.y} vs ${res.data.x}`,
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        toolbox: {
          feature: {
            saveAsImage: {},
            restore: {},
          },
        },
        xAxis: {
          type: "category",
          name: res.data.x,
          data: xValues,
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: "value",
          name: res.data.y,
        },
        series: [
          {
            type: "line",
            smooth: true,
            data: yValues,
          },
        ],
      };

      chartInstance.current.setOption(option, true);
      setHasPlot(true);
    } catch (err) {
      console.error(err);
      chartInstance.current?.clear();
      setHasPlot(false);
      setError(err.response?.data?.detail || "Failed to generate visualization.");
    } finally {
      setLoadingPlot(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="analytics-page">
      <nav className="home-navbar">
        <h2>XVector Data Analytics</h2>
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/data">Data</Link>
          <Link to="/analytics">Analytics</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="container">
        <h1>Data Analytics</h1>

        {error && <p className="error">{error}</p>}

        <div className="section">
          <h2>Select Dataset</h2>
          <select
            disabled={loadingPlot || loadingStats}
            value={selectedDatasetId}
            onChange={(e) => handleDatasetChange(e.target.value)}
          >
            <option value="">-- Choose a Dataset --</option>
            {datasets.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {datasets.length === 0 && (
            <p className="info-message">
              No datasets available. Upload one from the <Link to="/data">Data page</Link>.
            </p>
          )}
        </div>

        {selectedDatasetId && (
          <div className="grid">
            {/* Column Summary Statistics */}
            <div className="section">
              <h2>Column Statistics</h2>
              <select
                disabled={loadingStats}
                value={statColumn}
                onChange={(e) => {
                  setStatColumn(e.target.value);
                  fetchStats(e.target.value);
                }}
              >
                <option value="">-- Select Column --</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>

              {loadingStats ? (
                <p>Calculating statistics...</p>
              ) : stats ? (
                <div className="stats-results">
                  <h3>Stats for {stats.column || statColumn}</h3>
                  <p><strong>Count:</strong> {stats.count}</p>
                  <p><strong>Mean:</strong> {stats.mean?.toFixed(2)}</p>
                  <p><strong>Median:</strong> {stats.median?.toFixed(2)}</p>
                  <p><strong>Mode:</strong> {stats.mode?.toFixed(2)}</p>
                  <p><strong>Minimum:</strong> {stats.min?.toFixed(2)}</p>
                  <p><strong>Maximum:</strong> {stats.max?.toFixed(2)}</p>
                </div>
              ) : (
                <p>Select a column to inspect numeric stats.</p>
              )}
            </div>

            {/* Visualization Generator */}
            <div className="section">
              <h2>Visualization</h2>
              <div className="plot-controls">
                <label>
                  X-Axis:
                  <select
                    disabled={loadingPlot}
                    value={xColumn}
                    onChange={(e) => {
                      setXColumn(e.target.value);
                      setHasPlot(false);
                      chartInstance.current?.clear();
                    }}
                  >
                    <option value="">-- Select X --</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Y-Axis:
                  <select
                    disabled={loadingPlot}
                    value={yColumn}
                    onChange={(e) => {
                      setYColumn(e.target.value);
                      setHasPlot(false);
                      chartInstance.current?.clear();
                    }}
                  >
                    <option value="">-- Select Y --</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  disabled={!xColumn || !yColumn || loadingPlot}
                  onClick={() => fetchAndRenderPlot(xColumn, yColumn)}
                  style={{ marginTop: "10px" }}
                >
                  {loadingPlot ? "Generating..." : "Generate Chart"}
                </button>
              </div>

              {!hasPlot && !loadingPlot && (
                <p style={{ marginTop: "20px", color: "#666" }}>
                  Select both X and Y columns and click <strong>Generate Chart</strong> to render the visualization.
                </p>
              )}

              {/* Chart container stays continuously mounted with natural dimensions */}
              <div
                ref={chartRef}
                style={{
                  width: "100%",
                  height: "400px",
                  marginTop: "15px",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics; 