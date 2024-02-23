// DIRECT USER TO USER VIEW (candidate list) HOMEPAGE
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutesCompany = () => {

    const userType = localStorage.getItem("userType")
    
    return (
        userType === "company" ? <Outlet /> : <Navigate to={"/users/"} />
    )
}

export default PrivateRoutesCompany