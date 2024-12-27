//taskRoutes.js
import express from 'express';
import {addTask, deleteTask, getTasks, updateTask,getOneTask } from '../controllers/taskController.js'

const router =express.Router();

router.post('/addTask/:userId',addTask);

router.delete('/deleteTask/:objectId',deleteTask);

router.get('/getTasks/:userId',getTasks);

router.get('/getTask/:objectId',getOneTask);

router.put('/updateTask/:objectId',updateTask);



export default router;