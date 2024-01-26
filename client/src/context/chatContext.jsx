import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, postRequest, getRequest } from "../utills/services";
import {io} from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  console.log(">>>>>>>>", user);
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatError, setUserChatError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ sendTextMessageError, setSendTextMessageError ] = useState(null)
  const [ newMessage, setNewMessage ] = useState(null)
  const [ socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers]=useState([])

  console.log("onlineUsers", onlineUsers);

  useEffect(()=>{
    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);
    return ()=>{
        newSocket.disconnect()
    }
  },[user])

 // Add Online users
useEffect(()=>{
    if(socket === null) 
    {
        return;
    }
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res)=>{
        setOnlineUsers(res);
    });

    return () =>{   
        socket.off("getOnlineUsers");
    };
},[socket])

 // Send Message
useEffect(()=>{
    if(socket === null) 
    {
        return;
    }
    const recipientId = currentChat?.members?.find((id)=> id !== user?._id);
    socket.emit("sendMessage", {...newMessage, recipientId})

},[newMessage])

// Recieve message

useEffect(() =>{
    if(socket === null) 
    {
        return;
    }
    socket.on("getMessage", (res) =>{
        if(currentChat?._id !== res.chatId) return
        setMessages((prev)=> [...prev, res])
    })
    return () =>{   
        socket.off("getMessage");
    };

},[socket, currentChat])

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);
      console.log("response", response, user);
      if (response.error) {
        return console.log("Error Fetching Users", response);
      }
      const pChats = response?.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u?._id) {
          return false;
        }
        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatError(null);
        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
        setIsUserChatsLoading(false);
        if (response.error) {
          return setUserChatError(error);
        }
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessageError(null);
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );
      setIsMessagesLoading(false);
      if (response.error) {
        return setMessageError(error);
      }
      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats/`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return console.log("Error Creating Chat....", error);
    }
    setUserChats((prev) => [...prev, response]);
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    console.log("chatchatchatchatchat", chat);
    setCurrentChat(chat);
  }, []);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) console.log("You must be type something....");
      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender?._id,
          text: textMessage,
        })
      );
      if(response.error)
      {
        setSendTextMessageError(response);
      }
      setNewMessage(response);
      setMessages((prev)=>[...prev, response]);
      setTextMessage("")
    }
  );

  console.log("current chat", currentChat);
  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatError,
        potentialChats,
        createChat,
        updateCurrentChat,
        isMessagesLoading,
        messageError,
        messages,
        currentChat,
        sendTextMessage,
        onlineUsers
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
