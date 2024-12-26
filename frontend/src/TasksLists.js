import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Fab } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add'; // Round Plus Icon

const TaskLists = () => {
  const [lists, setList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // Dialog visibility state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState(null); // To store the selected task for updating
  const [isUpdate, setIsUpdate] = useState(false); // Flag to differentiate between add and update
  const [userId] = useState('12315'); // Hardcoded userId (this can be dynamic based on the logged-in user)

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks/getTask/12315`)
      .then((response) => {
        setList(response.data); // Set the list of tasks from the response
      })
      .catch((err) => {
        console.log("Error message", err); // Handle errors
      });
  }, [userId]);

  // Handle task creation (add new task)
  const handleAddTask = () => {
    const newTask = {
      taskTitle,
      task: taskDescription,
    };

    axios.post(`http://localhost:5000/api/tasks/addTask/${userId}`, newTask)
      .then((response) => {
        setList([...lists, response.data]); // Add the new task to the task list
        setOpenDialog(false); // Close the dialog
        setTaskTitle(''); // Reset the form inputs
        setTaskDescription('');
        toast.success("Task created successfully!"); // Show success message
      })
      .catch((err) => {
        console.log("Error creating task", err);
        toast.error("Failed to create task."); // Show error message
      });
  };

  // Handle task update
  const handleUpdateTask = () => {
    const updatedTask = {
      taskTitle,
      task: taskDescription,
    };

    axios.put(`http://localhost:5000/api/tasks/updateTask/${selectedTask._id}`, updatedTask)
      .then((response) => {
        // Update the task list with the updated task
        setList(lists.map(task => (task._id === selectedTask._id ? response.data.task : task)));
        setOpenDialog(false); // Close the dialog
        setTaskTitle(''); // Reset the form inputs
        setTaskDescription('');
        toast.success("Task updated successfully!"); // Show success message
      })
      .catch((err) => {
        console.log("Error updating task", err);
        toast.error("Failed to update task."); // Show error message
      });
  };

  // Handle opening the dialog for adding a new task
  const handleOpenDialog = () => {
    setIsUpdate(false); // Set isUpdate flag to false for adding new task
    setOpenDialog(true);
  };

  // Handle opening the dialog for updating a task
  const handleOpenUpdateDialog = (task) => {
    setIsUpdate(true); // Set isUpdate flag to true for updating task
    setSelectedTask(task); // Store selected task
    setTaskTitle(task.taskTitle); // Pre-fill task title
    setTaskDescription(task.task); // Pre-fill task description
    setOpenDialog(true); // Open the dialog
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:5000/api/tasks/deleteTask/${taskId}`)
      .then(() => {
        // Remove the deleted task from the list
        setList(lists.filter(task => task._id !== taskId));
        toast.success("Task deleted successfully!"); // Show success message
      })
      .catch((err) => {
        console.log("Error deleting task", err);
        toast.error("Failed to delete task."); // Show error message
      });
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTaskTitle(''); // Reset the form inputs
    setTaskDescription('');
  };

  return (
    <div>
      <h1>Tasks:</h1>
      <ul>
        {lists.length > 0 ? (
          lists.map((task) => (
            <li key={task._id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h3
                  onClick={() => handleOpenUpdateDialog(task)} // Clicking on title to show details in the update dialog
                  style={{ cursor: 'pointer', marginRight: '10px' }}
                >
                  {task.taskTitle}
                </h3>
                <button onClick={() => handleOpenUpdateDialog(task)} style={{ marginRight: '10px' }}>
                  Update
                </button>
                <button onClick={() => handleDeleteTask(task._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <h1>No Tasks</h1>
        )}
      </ul>

      {/* Add or Update Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isUpdate ? 'Update Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={isUpdate ? handleUpdateTask : handleAddTask} color="primary">
            {isUpdate ? 'Update Task' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button to trigger dialog */}
      <Fab
        color="primary"
        aria-label="add"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
        }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>

      {/* Toastify container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default TaskLists;
