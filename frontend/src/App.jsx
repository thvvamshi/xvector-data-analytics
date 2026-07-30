import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Analytics from "./pages/Analytics";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={token ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={token ? <Navigate to="/home" replace /> : <Register />}
      />

      {/* Protected */}
      <Route
        path="/home"
        element={token ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/data"
        element={token ? <Data /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/analytics"
        element={token ? <Analytics /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;