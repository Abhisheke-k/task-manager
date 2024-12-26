//db.js
import mongoose from 'mongoose';

const dbURI = "mongodb://0.0.0.0:27017/taskManager";
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));