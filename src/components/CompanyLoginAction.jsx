import React, { useContext, useState } from 'react'
import LoginIcon from '@mui/icons-material/Login';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'Context/AuthContext';
import NotLoginAction from './NotLoginAction';

const CompanyLoginAction = () => {
    const { user } = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()

    const [isNotLogin, setIsNotLogin] = useState(false)

    const onOpenIsNotLogin = () => {
        document.body.classList.add('disable-scroll');
        setIsNotLogin(true)
    }

    const onCloseIsNotLogin = () => {
        document.body.classList.remove('disable-scroll');
        setIsNotLogin(false)
    }

    return (
        <>  
            {(!user && location.pathname === "/") &&
                <div className='max-lg:hidden fixed z-2 flex items-center border xl:bottom-5 bottom-16 left-6 bg-dark-basic text-white p-4 rounded-lg cursor-pointer transition duration-300 hover:bg-white hover:text-dark-basic hover:border-dark-basic' onClick={() => onOpenIsNotLogin()} >
                    <p>Looking for candidate?</p>
                    <LoginIcon />
                </div>
            }
            {isNotLogin && 
                <NotLoginAction 
                    boxTitle="Login or Sign up as a company to see all potential candidates."
                    boxTagline="Build your company profile, look for potential candidates, and interact with them."
                    close={() => onCloseIsNotLogin()} />
            }
        </>
  )
}

export default CompanyLoginAction