// models/taskModel.js (Task Schema and Model)
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    taskTitle: { type: String, required: true },
    task: { type: Object, required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;
