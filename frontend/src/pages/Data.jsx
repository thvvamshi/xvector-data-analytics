import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";

function Data() {
  const [datasetName, setDatasetName] = useState("");
  const [file, setFile] = useState(null);

  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);

  const [preview, setPreview] = useState([]);
  const [columns, setColumns] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Separate loading states for localized UI feedback
  const [uploading, setUploading] = useState(false);

  // 3. Track the specific dataset ID currently loading its preview
  const [previewLoadingId, setPreviewLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDatasets();
  }, [page]);

  const fetchDatasets = async () => {
    try {
      setError("");
      const res = await api.get("/dataset", {
        params: {
          page,
          limit: 10,
        },
      });

      setDatasets(res.data.items || []);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
      setDatasets([]);
      setError("Failed to load datasets.");
    }
  };

  const handleUpload = async () => {
    if (!datasetName.trim()) {
      return alert("Dataset name is required.");
    }

    if (!file) {
      return alert("Please select a CSV file.");
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("name", datasetName);
      formData.append("file", file);

      await api.post("/dataset/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDatasetName("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchDatasets();

      // 1. Reset preview state after a fresh upload to prevent state confusion
      setSelectedDataset(null);
      setColumns([]);
      setPreview([]);

      alert("Dataset uploaded successfully!");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.detail || "Upload failed.";
      setError(message);
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const loadPreview = async (dataset) => {
    try {
      // 3. Track loading by specific dataset ID
      setPreviewLoadingId(dataset.id);
      setError("");

      const res = await api.get(`/dataset/${dataset.id}/preview`);

      setSelectedDataset(dataset);
      setColumns(res.data.columns || []);
      setPreview(res.data.rows || []);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.detail || "Failed to load preview.";
      setError(message);
      alert(message);
    } finally {
      setPreviewLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this dataset?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/dataset/${id}`);

      if (selectedDataset?.id === id) {
        setSelectedDataset(null);
        setPreview([]);
        setColumns([]);
      }

      await fetchDatasets();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.detail || "Delete failed.";
      setError(message);
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <div className="data-page">
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
        <h1>Data Management</h1>

        {error && <p className="error">{error}</p>}

        <div className="section">
          <h2>Upload Dataset</h2>

          <input
            type="text"
            placeholder="Dataset Name"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Dataset"}
          </button>
        </div>

        <div className="grid">
          <div className="section">
            <h2>My Datasets</h2>

            {datasets.length === 0 ? (
              <p>No datasets uploaded.</p>
            ) : (
              datasets.map((dataset) => (
                <div key={dataset.id} className="dataset-card">
                  <h3>{dataset.name}</h3>
                  <p>
                    {dataset.columns?.length ?? 0} columns
                    {dataset.rows !== undefined && ` • ${dataset.rows} rows`}
                  </p>

                  <div className="dataset-actions">
                    {/* 3. Button accurately reflects its own loading state */}
                    <button
                      disabled={
                        previewLoadingId === dataset.id ||
                        deletingId === dataset.id
                      }
                      onClick={() => loadPreview(dataset)}
                    >
                      {previewLoadingId === dataset.id
                        ? "Loading..."
                        : "Preview"}
                    </button>

                    <button
                      disabled={
                        deletingId === dataset.id ||
                        previewLoadingId === dataset.id
                      }
                      onClick={() => handleDelete(dataset.id)}
                    >
                      {deletingId === dataset.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="section">
            <h2>Preview</h2>

            {previewLoadingId !== null ? (
              <p>Loading preview data...</p>
            ) : selectedDataset ? (
              <>
                <h3>{selectedDataset.name}</h3>

                {preview.length === 0 ? (
                  <p>No preview data available.</p>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          {columns.map((column) => (
                            <th key={column}>{column}</th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {preview.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {columns.map((column) => (
                              <td key={`${rowIndex}-${column}`}>
                                {row[column]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <p>Select a dataset to preview.</p>
            )}
          </div>
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data;
