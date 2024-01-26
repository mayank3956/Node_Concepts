
const { Server } = require("socket.io");

const io = new Server({ cors:"http://localhost:5173"});
let onlineUsers = []
io.on("connection", (socket) => {
  console.log(" User connected", socket.id);
  //listen conection
  socket.on("addNewUser", (userId)=>{
    console.log(userId);
    !onlineUsers.some(user => user.userId === userId)  && userId !== null &&  onlineUsers.push({userId, socketId: socket.id})
    console.log("Online users", onlineUsers)
    io.emit("getOnlineUsers", onlineUsers)
  })
  socket.on("sendMessage", (message)=>{
    const user = onlineUsers?.find(user => user?.userId === message.recipientId)
    console.log("useruseruseruser", user);
    if(user)
    {
        io.to(user.socketId).emit("getMessage", message)
    }
  })
  socket.on("disconnect", () =>{
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers)
  })
});

io.listen(5001);