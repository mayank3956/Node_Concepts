import { createContext, useCallback, useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom'
import { baseUrl, postRequest } from "../utills/services";
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext();
export const AuthContextProvider = ({children})=>{
    const navigate = useNavigate()
    const [user, setUser]= useState(null)
    const [registerInfo, setRegisterInfo] = useState({
        name:"",
        email:"",
        password:""
    })
    const [loginInfo, setLoginInfo] = useState({
        email:"",
        password:""
    })
    useEffect(()=>{
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    },[])

    console.log("user", user);
    console.log("login user", loginInfo);

    const [registerError, setRegisterError]= useState(null);
    const [isRegisterLoading, setIsRegisterLoading]= useState(false)

    const updateRegisterInfo = useCallback((info)=>{
        setRegisterInfo(info)
    },[])
    const [loginError, setLoginError]= useState(null);
    const [isLoginLoading, setIsLoginLoading]= useState(false)

    const updateLoginInfo = useCallback((info)=>{
        setLoginInfo(info)
    },[])

    const registerUser = useCallback(async(e)=>{
      
        e.preventDefault()
        setIsRegisterLoading(true)
        setRegisterError(null)
        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo))
        console.log("response", response);
        setIsRegisterLoading(false)
        if(response.error)
        {
            return setRegisterError(response);
        }
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
    },[registerInfo])  

    const logoutUser = useCallback(async(e)=>{
        localStorage.removeItem("User");
        setUser(null);
    },[])

    const loginUser = useCallback(async(e)=>{
        e.preventDefault();
        setIsLoginLoading(true)
        setLoginError(null)
        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        setIsLoginLoading(false)
        if(response.error)
        {
            return setLoginError(response)
        }
        localStorage.setItem("User", JSON.stringify(response) );
        setUser(response)
    },[loginInfo])

    return <AuthContext.Provider
    value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerError,
        registerUser,
        isRegisterLoading,
        logoutUser,
        loginUser,
        isLoginLoading,
        loginError,
        updateLoginInfo,
        loginInfo,
    }}
    >
        {children}
    </AuthContext.Provider>
}