import { useState, useEffect } from "react";
import { baseUrl, getRequest } from "../utills/services";

export const useFetchRecipientUser = (chat, user) =>{
    const [recipientUser, setRecipientUser ] = useState(null);
    const [error, setError] = useState(null);
    console.log("Userrrrrrr", chat?.members, user);
    const recipientId = chat?.members?.find((id)=> id !== user?._id);
    console.log("recipientId", recipientId);

    useEffect(()=>{
        const getUser = async()=>{
            if(!recipientId)
            {
                return null;
            }
            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
            if(response.error)
            {
                return setError(response.error)
            }
            setRecipientUser(response)
        }
        getUser();
    },[recipientId])

    return { recipientUser, error}
}