
import {useContext} from "react"
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () =>{
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);
    const { user } = useContext(AuthContext)
   console.log("onlineUsers", onlineUsers);
   return (
    <div className="all-users">
        {
            potentialChats && potentialChats?.map((pchats, index)=>{
                return(
                    <div className="single-user" key={index} onClick={()=> createChat(user?._id, pchats?._id) }>
                    {pchats?.name}
                    <span className={onlineUsers?.some((user)=> user?.userId === pchats?._id) ? "user-online" : ""}></span>
                </div>
                )           
            })
        }
    </div>
   )
}
export default PotentialChats;