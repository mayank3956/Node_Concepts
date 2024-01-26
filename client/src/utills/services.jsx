export const baseUrl = "http://localhost:5002/api";

export const postRequest = async(url, body)=>
{
const response = await fetch(url, {
    method:"POST",
    headers:{
        "Content-type":"application/json"
    },
    body
})
const data = await response.json();
let message;
if(!response.ok)
{
    if(data?.message) 
    {
        message= data.message;
    }
    else{
        message=data
    }
    return {error:true, message}
}

return data; 
} 

export const getRequest = async(url)=>{
    const response = await fetch(url);
    const data = await response.json()
    if(!response.ok)
    {
        let message= "An Error Occured...";
        if(data?.message)
        {
            message= data.message;
        }
        return { error: true, message}
    }
    return data;
}