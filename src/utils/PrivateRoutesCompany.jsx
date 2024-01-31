// DIRECT USER TO USER VIEW (candidate list) HOMEPAGE
import AuthContext from 'Context/AuthContext'
import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutesCompany = () => {

    const { user } = useContext(AuthContext);

    const userType = localStorage.getItem("userType")
    
    return (
        user 
        ?
        userType === "company" ? <Outlet /> : <Navigate to={"/"} />
        : <Navigate to={"/login/"} />
    )
}

export default PrivateRoutesCompany