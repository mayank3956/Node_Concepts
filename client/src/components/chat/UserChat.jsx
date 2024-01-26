import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import profile from "../../../public/profile.svg"
import { useContext } from "react";
import { ChatContext } from "../../context/chatContext";

const UserChat = ({chat, user}) =>{
    console.log("chat", chat);
    const {recipientUser}= useFetchRecipientUser(chat, user);
    const { onlineUsers } = useContext(ChatContext);
    const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id)
    return (
        <div>
    <Stack
     direction="horizontal"
     gap={3}
     className="user-card align-items-center p-2 justify-content-between">
        <div className="d-flex">
            <div className="me-2">
               <img src={profile} height="35px"/>
            </div>
            <div className="text-content">
                <div className="name">
                    {recipientUser?.name}
                </div>
                <div className="text">
                    Text Message
                </div>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end">
            <div className=""date>
                12/12/2024
            </div>
            <div className="this-user-notifications">
                2
            </div>
            <span className={isOnline ? "user-online" :""}></span>
        </div>
    </Stack>
    </div>
    )
}

export default UserChat;