import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const TaskDialog = ({ open, taskTitle, taskDescription, setTaskTitle, setTaskDescription, isUpdate, handleAddTask, handleUpdateTask, closeDialog }) => {
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
