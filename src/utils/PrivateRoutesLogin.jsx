import React, { useContext } from 'react'
import { Outlet } from "react-router-dom"
import AuthContext from "../Context/AuthContext"

const PrivateRoutesLogin = () => {

  const { user } = useContext(AuthContext)
  
    if (user){
        return window.location.href = "/"
    } else {
        return <Outlet />
    }
}

export default PrivateRoutesLogin