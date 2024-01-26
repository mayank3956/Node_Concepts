const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRouter = require("./routes/userRoute")
const chatRouter = require("./routes/chatRoute")
const messageRouter = require("./routes/messageRoute")
require("dotenv").config();

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5002;
const mongoDBURL = process.env.MONGODB_URL

app.get("/", (req, res)=>{
res.send("Welcome our chat app");
})
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter)
app.use("/api/messages", messageRouter )

app.listen(port,(req, res)=>{
    console.log("Server Started on port number:", port)
})

mongoose.connect(mongoDBURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("MongoDB connected");
}).catch((error)=>{       
    console.log("Mongodb Connection failed", error);
})
