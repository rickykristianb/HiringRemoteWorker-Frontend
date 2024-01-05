// DIRECT USER TO USER VIEW (candidate list) HOMEPAGE
import React from 'react'
import { useNavigate, Navigate, Outlet } from 'react-router-dom'

const PrivateRoutesCompany = () => {
    const navigate = useNavigate()
    const userType = localStorage.getItem("userType")
    
    return (
        // console.log("USER TYPEEEEEEEEEEEEEEE", userType)
        userType === "company" ? <Outlet /> : <Navigate to={"/jobs/"} />
    )
}

export default PrivateRoutesCompany