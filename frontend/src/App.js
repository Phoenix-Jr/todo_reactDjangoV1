import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const url = "http://127.0.0.1:8000/";
  const [task, setTask] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [inputTask, setInputtask] = useState("");
  const [activeTask, setActiveTask] = useState(null);

  const getAllTask = () => {
    setLoading(true);
    axios
      .get(url + "todo/list")
      .then((res) => {
        setTask(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const addTask = () => {
    if (activeTask === null) {
      axios
        .post(url + "todo/add/", {
          title: inputTask,
          status: false,
        })
        .then((res) => {
          getAllTask();
          setInputtask("");
          setActiveTask(null);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .put(url + "todo/update/" + activeTask.id, {
          title: inputTask,
          status: activeTask.status,
        })
        .then((res) => {
          getAllTask();
          setInputtask("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleChange = (e) => {
    setInputtask(e.target.value);
  };
  const deleteTask = (task) => {
    axios
      .delete(url + "todo/delete/" + task.id)
      .then((res) => getAllTask())
      .catch((err) => console.log(err));
  };
  const toggleTask = (task) => {
    axios
      .put(url + "todo/update/" + task.id, {
        title: task.title,
        status: !task.status,
      })
      .then((res) => getAllTask())
      .catch((err) => console.log(err));
  };
  const updateTask = (task) => {
    setActiveTask(task);
    setInputtask(task.title);
  };
  useEffect(() => getAllTask(), []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Django React Todo APP</p>
      </header>
      <div className="main">
        <div className="input-task">
          <input
            type="text"
            placeholder="Ajouter une tâche"
            value={inputTask}
            onChange={(e) => handleChange(e)}
          />
          <button onClick={addTask} disabled={!inputTask.trim()}>
            Ajouter
          </button>
        </div>
        <ul>
          {isLoading ? (
            <h4>Is loading</h4>
          ) : (
            task.map((task) => (
              <div className="task-list" key={task.id}>
                <input
                  type="checkbox"
                  onChange={() => toggleTask(task)}
                  checked={task.status}
                />
                <li>
                  {task.status ? <strike>{task.title}</strike> : task.title}
                </li>
                <div className="button">
                  <button className="edit" onClick={() => updateTask(task)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => deleteTask(task)}>
                    X
                  </button>
                </div>
              </div>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
