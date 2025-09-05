import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(null);
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [loginInfo, setLoginInfo] = useState({ username: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingTask, setEditingTask] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    if (!loginInfo.username.trim() && !loginInfo.password.trim()) {
      setMessage("Username and Password are required.");
      return;
    }
    try {
      const res = await axios.post(`${API}/login`, loginInfo);
      setToken(res.data.token);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  const fetchTodos = async () => {
    const res = await axios.get(`${API}/todos`);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!task.trim()) return;
    await axios.post(`${API}/todos`, { task });
    setTask("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/todos/${id}`);
    fetchTodos();
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTask(todo.task);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTask("");
  };

  const saveEdit = async () => {
    if (!editingTask.trim()) return;
    await axios.put(`${API}/todos/${editingId}`, { task: editingTask });
    setEditingId(null);
    setEditingTask("");
    fetchTodos();
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={loginInfo.username}
            className="input1"
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={loginInfo.password}
            className="input2"
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, password: e.target.value })
            }
          />
          {message && (
            <div id="err-msg" className="err-msg">
              {message}
            </div>
          )}
          <button id="login-btn" className="btn" onClick={login}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Todo App</h2>
        <div className="todo-form">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task..."
          />
          <button onClick={addTodo} className="btn">
            Add
          </button>
        </div>
        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li key={todo.id} id={`task-${index}`} className="todo-item">
              {editingId === todo.id ? (
                <>
                  <input
                    value={editingTask}
                    id="edit-int"
                    onChange={(e) => setEditingTask(e.target.value)}
                  />
                  <div className="todo-actions">
                    <button className="btn small" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="btn small cancel" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{todo.task}</span>
                  <div className="todo-actions">
                    <button
                      className="btn small"
                      onClick={() => startEdit(todo)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn small delete"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
