import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [newItemText, setNewItemText] = useState('');
  const API_URL = 'http://localhost:3000/todos';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (title) => {
    try {
      const response = await axios.post(API_URL, { title });
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddItem = async (taskId, itemText) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      const updatedItems = [...(task.items || []), { text: itemText }];
      const response = await axios.put(`${API_URL}/${taskId}`, {
        ...task,
        items: updatedItems,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === taskId ? response.data : t))
      );
      setActiveTask(null);
      setNewItemText('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };


  const handleDeleteItem = async (taskId, itemId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      const updatedItems = task.items.filter((item) => item._id !== itemId);
      const response = await axios.put(`${API_URL}/${taskId}`, {
        ...task,
        items: updatedItems,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === taskId ? response.data : t))
      );
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openModal = (taskId) => {
    setActiveTask(taskId);
  };

  const closeModal = () => {
    setActiveTask(null);
  };

  return (
    <div className="todo-list">
      <h1>Task List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (newTask.trim()) handleAddTask(newTask);
        }}
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task"
        />
        <button type="submit">+</button>
      </form>
      <div className="tasks">
        {tasks.map((task) => (
          <div key={task._id} className="task-box">
            <div className="button-container">
              <button className="add-item" onClick={() => openModal(task._id)}>
                +
              </button>
              <button
                className="delete-task"
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete Task
              </button>
            </div>
            <h2>{task.title}</h2>
            <ul>
              {(task.items || []).map((item) => (
                <li key={item._id}>
                  {item.text}
                  <button
                    className="delete-item"
                    onClick={() => handleDeleteItem(task._id, item._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            {activeTask === task._id && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Add New Item</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newItemText.trim())
                        handleAddItem(activeTask, newItemText);
                    }}
                  >
                    <input
                      type="text"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      placeholder="Item description"
                    />
                    <button type="submit">+</button>
                    <button type="button" onClick={closeModal}>
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToDoList;
