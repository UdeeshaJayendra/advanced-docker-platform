import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(`${data.status} — ${data.service}`);
      })
      .catch(() => {
        setBackendStatus("Backend unavailable");
      });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>TaskFlow</h1>
        <p>Advanced Docker Platform</p>
      </header>

      <main className="dashboard">
        <section className="welcome">
          <h2>Team Task Management</h2>
          <p>Manage your team's tasks from one place.</p>
        </section>

        <section className="stats">
          <div className="card">
            <h3>Total Tasks</h3>
            <strong>12</strong>
          </div>

          <div className="card">
            <h3>In Progress</h3>
            <strong>5</strong>
          </div>

          <div className="card">
            <h3>Completed</h3>
            <strong>7</strong>
          </div>
        </section>

        <section className="tasks">
          <h2>Recent Tasks</h2>

          <div className="task">
            <span>Build Docker environment</span>
            <span>In Progress</span>
          </div>

          <div className="task">
            <span>Configure backend API</span>
            <span>Completed</span>
          </div>

          <div className="task">
            <span>Design frontend dashboard</span>
            <span>Pending</span>
          </div>
        </section>

        <section className="tasks">
          <h2>Backend Status</h2>
          <p>{backendStatus}</p>
        </section>
      </main>
    </div>
  );
}

export default App;