import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Correct the path here
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TaskDialog from './TaskDialog.js';  // Correct the path here
import BootstrapDialogBox from './BootstrapDialogBox.js';  
const TaskLists = () => {
  const [lists, setList] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [userId] = useState('12315');
  const [openMessageDialog, setOpenMessageDialog] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks/getTasks/12315`)
      .then((response) => {
        setList(response.data);
      })
      .catch((err) => {
        console.log("Error message", err);
      });
  }, [userId]);

  const handleAddTask = () => {
    const newTask = { taskTitle, task: taskDescription };

    axios.post(`http://localhost:5000/api/tasks/addTask/${userId}`, newTask)
      .then((response) => {
        setList([...lists, response.data]);
        setTaskTitle('');
        setTaskDescription('');
        toast.success("Task created successfully!");
      })
      .catch((err) => {
        console.log("Error creating task", err);
        toast.error("Failed to create task.");
      });
  };

  const handleUpdateTask = () => {
    const updatedTask = { taskTitle, task: taskDescription };

    axios.put(`http://localhost:5000/api/tasks/updateTask/${selectedTask._id}`, updatedTask)
      .then((response) => {
        setList(lists.map(task => (task._id === selectedTask._id ? response.data.task : task)));
        setTaskTitle('');
        setTaskDescription('');
        toast.success("Task updated successfully!");
      })
      .catch((err) => {
        console.log("Error updating task", err);
        toast.error("Failed to update task.");
      });
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:5000/api/tasks/deleteTask/${taskId}`)
      .then(() => {
        setList(lists.filter(task => task._id !== taskId));
        toast.success("Task deleted successfully!");
      })
      .catch((err) => {
        console.log("Error deleting task", err);
        toast.error("Failed to delete task.");
      });
  };

  const handleViewTask = async (task) => {
    const responseData = await axios.get(`http://localhost:5000/api/tasks/getTask/${task._id}`);
    setTaskDescription(responseData.data.result.task);
    setTaskTitle(task.taskTitle);
    setOpenMessageDialog(true);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Tasks</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {lists.length > 0 ? (
          lists.map((task) => (
            <li key={task._id} style={{ margin: '10px 15px 10px 15px', height: '100px' }}>
              <div style={{
                border: '2px solid #000',
                borderRadius: '10px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <h3
                  onClick={() => handleViewTask(task)}
                  style={{ cursor: 'pointer', flexGrow: 1, textAlign: 'center' }}
                >
                  {task.taskTitle}
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setSelectedTask(task)}>Update</button>
                  <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <h2 style={{ textAlign: 'center' }}>No Tasks</h2>
        )}
      </ul>

      <TaskDialog
        open={selectedTask !== null}
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        setTaskTitle={setTaskTitle}
        setTaskDescription={setTaskDescription}
        isUpdate={selectedTask !== null}
        handleAddTask={handleAddTask}
        handleUpdateTask={handleUpdateTask}
        closeDialog={() => setSelectedTask(null)}
      />

      <BootstrapDialogBox
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        open={openMessageDialog}
        handleClose={() => setOpenMessageDialog(false)}
      />

      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        onClick={() => setSelectedTask(null)} // Opens Add Task dialog
      >
        <AddIcon />
      </Fab>

      <ToastContainer />
    </div>
  );
};

export default TaskLists;
