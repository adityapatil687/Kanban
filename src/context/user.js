import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const UserContext = createContext();
const UserContextProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [userData, setUserData] = useState({
    
    name: "Aditya Patil",
    profileImage: require("../assets/user_3d.jpg"),
    email: "manager@gmail.com",
    role: "manager"
  });
  // const navigate = useNavigate();
  // useEffect(()=>{
  //   if (isSignedIn == false)
  //   {
  //     navigate("/auth")
  //   }
  // },[isSignedIn])
  return (
    <UserContext.Provider value={{ isSignedIn, setIsSignedIn, userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
