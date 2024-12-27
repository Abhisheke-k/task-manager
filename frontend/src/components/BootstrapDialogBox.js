import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialogBox = ({ open, taskTitle, taskDescription, handleClose }) => {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          width: '600px',
          height: '400px',
          margin: 'auto',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {taskTitle}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>{taskDescription}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BootstrapDialogBox;
