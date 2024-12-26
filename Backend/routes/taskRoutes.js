//taskRoutes.js
import express from 'express';
import {addTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js'

const router =express.Router();

router.post('/addTask/:userId',addTask);

router.delete('/deleteTask/:objectId',deleteTask);

router.get('/getTask/:userId',getTasks);

router.put('/updateTask/:objectId',updateTask);



export default router;