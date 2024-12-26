//app.js
import express from 'express';
import taskRoutes from './routes/taskRoutes.js';
import './db/db.js';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/tasks',taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`server is listening on ${PORT}`);
});