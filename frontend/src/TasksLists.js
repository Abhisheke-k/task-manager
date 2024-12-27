import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Fab, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const TaskLists = () => {
  const [lists, setList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [userId] = useState('12315');
  const [openMessageDialog, setOpenMessageDialog] = useState(false); // used for showing message dialog status

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tasks/getTasks/12315`)
      .then((response) => {
        setList(response.data);
        console.log(response.data);
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
        setOpenDialog(false);
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
        setOpenDialog(false);
        setTaskTitle('');
        setTaskDescription('');
        toast.success("Task updated successfully!");
      })
      .catch((err) => {
        console.log("Error updating task", err);
        toast.error("Failed to update task.");
      });
  };

  const handleOpenDialog = () => {
    setIsUpdate(false);
    setTaskTitle('');
    setTaskDescription('');
    setOpenDialog(true);
  };

  const handleOpenUpdateDialog = (task) => {
    setIsUpdate(true);
    setSelectedTask(task);
    setTaskTitle(task.taskTitle);
    setTaskDescription(task.task);
    setOpenDialog(true);
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTaskTitle('');
    setTaskDescription('');
  };

  const handleViewTask = async(task) => {
    console.log(task._id)
   const responseData =await axios.get(`http://localhost:5000/api/tasks/getTask/${task._id}`);
   console.log(responseData.data.result);
    
    setTaskDescription(responseData.data.result.task);
    setTaskTitle(task.taskTitle);
    setOpenMessageDialog(true);
  };

  const handleCloseShowMessage = () => {
    setOpenMessageDialog(false);
    setTaskDescription('');
    setTaskTitle('');
  };

  //const showMessageStyle={height:'1500px',width:'2000px'}

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
                  <button onClick={() => handleOpenUpdateDialog(task)}>Update</button>
                  <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <h2 style={{ textAlign: 'center' }}>No Tasks</h2>
        )}
      </ul>

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
      <React.Fragment>
      <BootstrapDialog
        onClose={handleCloseShowMessage}
        aria-labelledby="customized-dialog-title"
        open={openMessageDialog}
        maxWidth="md" // Set max width (xs, sm, md, lg, xl)
        fullWidth // Ensures it takes the full width up to maxWidth
        PaperProps={{
          sx: {
            width: '600px', // Fixed width
            height: '400px', // Fixed height
            margin: 'auto', // Centers the dialog
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {taskTitle}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseShowMessage}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            {taskDescription}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseShowMessage}>
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>
      </React.Fragment>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>

      <ToastContainer />
    </div>
  );
};

export default TaskLists;
