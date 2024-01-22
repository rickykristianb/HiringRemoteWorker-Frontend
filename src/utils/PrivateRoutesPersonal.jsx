import AuthContext from 'Context/AuthContext'
import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutesPersonal = () => {

    const userType = localStorage.getItem("userType")
    const { user } = useContext(AuthContext)
    
    return (
        !user ? <Outlet /> : userType === "personal" ? <Outlet /> : <Navigate to={"/users/"} />
    )
  
}

export default PrivateRoutesPersonal