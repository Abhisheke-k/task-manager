import React from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const TaskDialog = ({ open, taskTitle, taskDescription, setTaskTitle, setTaskDescription, isUpdate, closeDialog, selectedTask, setList, lists, userId }) => {

  const handleUpdateTask = async () => {
    const updatedTask = { taskTitle, task: taskDescription };

    await axios.put(`http://localhost:5000/api/tasks/updateTask/${selectedTask._id}`, updatedTask)
      .then((response) => {
        const updatedList = lists.map(task =>
          task._id === selectedTask._id ? response.data.task : task
        );
        setList(updatedList);
        setTaskTitle('');
        setTaskDescription('');
        closeDialog(false);
        toast.success("Task updated successfully!");
      })
      .catch((err) => {
        console.log("Error updating task", err);
        toast.error("Failed to update task.");
      });
  };

  const handleAddTask = async () => {
    const newTask = { taskTitle, task: taskDescription };

    try {
      const response = await axios.post(`http://localhost:5000/api/tasks/addTask/${userId}`, newTask);
      setList([...lists, response.data]);
      setTaskTitle('');
      setTaskDescription('');
      closeDialog(false);
      toast.success("Task created successfully!");
    } catch (err) {
      console.log("Error creating task", err);
      toast.error("Failed to create task.");
    }
  };

  return (
    <Dialog open={open} onClose={closeDialog}>
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
        <Button onClick={closeDialog} color="secondary">Cancel</Button>
        <Button onClick={isUpdate ? handleUpdateTask : handleAddTask} color="primary">
          {isUpdate ? 'Update Task' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
