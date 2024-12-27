//taskController.js
import Task from '../models/taskModel.js';
import mongoose from 'mongoose'; // Import mongoose


export const addTask = async (req,res)=>{ // ok
const userId=req.params.userId.trim();
const {taskTitle,task} =req.body;
const obj={taskTitle,task,userId};
try{
const newTask = new Task(obj);
await newTask.save();
res.status(201).json(obj);
}
catch(err){
console.log("error",err);
res.status(500).json({ message: err.message });
}

};


export const deleteTask = async (req,res)=>{
 const objectId=req.params.objectId.trim();
 try{
    //console.log(objectId);
    await Task.findByIdAndDelete(objectId);
    
    res.status(200).json({message:"task is successfully deleted"});
 }
 catch(err){
    console.log("error",err);
    res.status(500).json({message:err.message});
 }
};



export const updateTask = async (req, res) => {
    const  objectId  = req.params.objectId; // Extract objectId from URL parameters
    const updatedTask = req.body;   // Extract updated task data from the request body
    
    try {
        // Convert the objectId from string to MongoDB ObjectId type
        if (!mongoose.Types.ObjectId.isValid(objectId)) {
            return res.status(400).json({ message: "Invalid ObjectId" });
        }

        // Find the task by ObjectId and update it
        const updatedDoc = await Task.findByIdAndUpdate(
            objectId,                        // Find document by ObjectId
            { $set: updatedTask },            // Update the task fields with the new data
            { new: true }                     // Return the updated document
        );

        if (!updatedDoc) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", task: updatedDoc });
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ message: err.message });
    }
};

export const getTasks = async (req, res) => {  //ok
    const  UI  = req.params.userId.trim();  // Get userId from request params
    console.log("api called  <get all tasks> ");
    try {
        //console.log("entered");
        await Task.find( { userId: UI }, { userId: 1, taskTitle: 1, _id: 1 })
        .then((task)=>{
            res.status(200).json(task);
            // console.log("all task has response. sent");
            // console.log(task)
        });
           
          
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getOneTask = async (req,res) =>{
    const objectId = req.params.objectId;
    console.log("api entered <task description>");
    console.log("objectId: "+objectId);
    try{
      const result =  await Task.findOne({"_id":objectId})
      console.log("result", result)      
      return res.status(200).send({status : "success",
        statusCode:200,
        message: "successfully fetched task data",
        result});
      

        // await Task.findById(objectId).select('task').then((task)=>{
        //     res.status(200).json(task);
        //     console.log("task message");
        //     console.log(task);
        // })
    }
    catch(err){
        res.status(400);
    }
}

// don't use destructing object in params