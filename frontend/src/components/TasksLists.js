import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskDialog from './TaskDialog.js';
import BootstrapDialogBox from './BootstrapDialogBox.js';

const TaskLists = () => {
  const [lists, setList] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);  // State to control dialog visibility
  const [userId] = useState('12315');
  const [openMessageDialog, setOpenMessageDialog] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks/getTasks/${userId}`)
      .then((response) => {
        setList(response.data);
      })
      .catch((err) => {
        console.log("Error fetching tasks", err);
      });
  }, [userId]);

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
    try {
      const responseData = await axios.get(`http://localhost:5000/api/tasks/getTask/${task._id}`);
      setTaskDescription(responseData.data.result.task);
      setTaskTitle(task.taskTitle);
      setOpenMessageDialog(true);
    } catch (err) {
      console.log("Error fetching task details", err);
    }
  };

  const openAddTaskDialog = () => {
    setSelectedTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setIsUpdate(false);
    setOpenDialog(true);  // Open the dialog for adding
  };

  const openUpdateTaskDialog = (task) => {
    setSelectedTask(task);
    setTaskTitle(task.taskTitle);
    setTaskDescription(task.task);
    setIsUpdate(true);
    setOpenDialog(true);  // Open the dialog for updating
  };

  const closeTaskDialog = () => {
    setSelectedTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setIsUpdate(false);
    setOpenDialog(false);  // Close the dialog explicitly
  };

  return (
    <div>
      <div className="header">
        <h1 style={{ flexGrow: 1, textAlign: 'center' }}>Tasks</h1>
        <button onClick={openAddTaskDialog}>Add Task</button>
      </div>
      <div className="task-list-container">
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {lists.length > 0 ? (
            lists.map((task) => (
              <li key={task._id} className="task-item">
                <div className="task-card">
                  <h3 onClick={() => handleViewTask(task)} className="task-title">
                    {task.taskTitle}
                  </h3>
                  <div className="task-actions">
                    <button onClick={() => openUpdateTaskDialog(task)}>Update</button>
                    <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <h2 style={{ textAlign: 'center' }}>No Tasks</h2>
          )}
        </ul>
      </div>

      <TaskDialog
        open={openDialog}
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        setTaskTitle={setTaskTitle}
        setTaskDescription={setTaskDescription}
        isUpdate={isUpdate}
        closeDialog={closeTaskDialog}
        selectedTask={selectedTask}
        setList={setList}
        lists={lists}
        userId={userId}
      />

      <BootstrapDialogBox
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        open={openMessageDialog}
        handleClose={() => setOpenMessageDialog(false)}
      />

      <ToastContainer position="top-left" />
    </div>
  );
};

export default TaskLists;
