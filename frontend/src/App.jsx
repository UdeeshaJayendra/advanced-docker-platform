import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadTasks = async () => {
    try {
      const response = await fetch("/api/tasks");

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Please enter a task title.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const url = editingId
        ? `/api/tasks/${editingId}`
        : "/api/tasks";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: title.trim(),
          status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setTitle("");
      setStatus("pending");
      setEditingId(null);

      await loadTasks();

      setMessage(
        editingId
          ? "Task updated successfully."
          : "Task created successfully."
      );
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setStatus(task.status);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task");
      }

      await loadTasks();

      setMessage("Task deleted successfully.");

      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setStatus("pending");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setStatus("pending");
    setMessage("");
  };

  const totalTasks = tasks.length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>TaskFlow</h1>
          <p>Advanced Docker Platform</p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="dashboard">

        <section className="hero">
          <div>
            <span className="eyebrow">
              TASK MANAGEMENT PLATFORM
            </span>

            <h2>
              Manage your team's work with TaskFlow.
            </h2>

            <p>
              Create, track, update and complete tasks
              through a containerized application platform.
            </p>
          </div>

          <div className="docker-badge">
            <strong>Docker</strong>
            <span>Compose Platform</span>
          </div>
        </section>

        <section className="stats">

          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pending}</strong>
          </div>

        </section>

        <section className="panel">

          <div className="panel-header">
            <div>
              <span className="eyebrow">
                TASK WORKFLOW
              </span>

              <h2>
                {editingId ? "Edit Task" : "Create Task"}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="task-title">
                Task title
              </label>

              <input
                id="task-title"
                name="title"
                type="text"
                value={title}
                placeholder="e.g. Configure Docker monitoring"
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-status">
                Status
              </label>

              <select
                id="task-status"
                name="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

            <div className="form-actions">

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Task"
                    : "Create Task"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

        </section>

        <section className="panel">

          <div className="panel-header">

            <div>
              <span className="eyebrow">
                DATABASE
              </span>

              <h2>Tasks</h2>
            </div>

            <span className="task-count">
              {totalTasks}{" "}
              {totalTasks === 1 ? "task" : "tasks"}
            </span>

          </div>

          {tasks.length === 0 ? (

            <div className="empty-state">
              <strong>No tasks yet</strong>
              <p>
                Create your first task using the form above.
              </p>
            </div>

          ) : (

            <div className="task-list">

              {tasks.map((task) => (

                <div
                  className="task-row"
                  key={task._id}
                >

                  <div className="task-info">

                    <h3>{task.title}</h3>

                    <span>
                      Created{" "}
                      {new Date(
                        task.createdAt
                      ).toLocaleString()}
                    </span>

                  </div>

                  <span
                    className={`task-status ${task.status}`}
                  >
                    {task.status === "in-progress"
                      ? "In Progress"
                      : task.status === "completed"
                        ? "Completed"
                        : "Pending"}
                  </span>

                  <div className="task-actions">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDelete(task._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        <section className="panel">

          <div className="panel-header">

            <div>
              <span className="eyebrow">
                PLATFORM
              </span>

              <h2>Infrastructure Status</h2>
            </div>

          </div>

          <div className="platform-grid">

            <div className="platform-item">
              <span className="status-dot"></span>
              <strong>Backend API</strong>
              <small>Operational</small>
            </div>

            <div className="platform-item">
              <span className="status-dot"></span>
              <strong>MongoDB</strong>
              <small>Operational</small>
            </div>

            <div className="platform-item">
              <span className="status-dot"></span>
              <strong>Redis</strong>
              <small>Operational</small>
            </div>

            <div className="platform-item">
              <span className="status-dot"></span>
              <strong>Worker</strong>
              <small>Operational</small>
            </div>

          </div>

        </section>

      </main>

      <footer>
        TaskFlow · Powered by Docker Compose
      </footer>

    </div>
  );
}

export default App;