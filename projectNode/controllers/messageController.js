const messageModel = require("../models/messageModel");

//createMessage
//getMessage

const createMessage = async(req, res)=>{
    const { chatId, senderId, text } = req.body;
    const messgae = new messageModel(
        {
            chatId, senderId, text
        }
    )
    try{
        const response = await messgae.save();
        res.status(200).json(response);
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
       }
}

const getMessage = async(req, res)=>{
    const {chatId} = req.params;
    console.log(chatId);
    try{
        const response = await messageModel.find({chatId});
        console.log("response",response);
        res.status(200).json(response);
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
       }
}

module.exports = {getMessage, createMessage};