import React from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';

const NotLoginAction = (props) => {
    const navigate = useNavigate()

    const onClickSignUp = () => {
        document.body.classList.remove('disable-scroll');
        navigate("/register/")
        props.close()
    }

    const onClickLogin = () => {
        document.body.classList.remove('disable-scroll');
        navigate("/login/")
        props.close()
    }

  return (
    <div className='flex justify-center items-center z-5 fixed top-0 left-0 bg-pop-up-bg w-screen h-screen overflow-y-scroll' onClick={props.close}>
        <div className='flex flex-col justify-center items-center gap-5 bg-white p-[40px] pt-0 w-[480px] max-sm:w-[350px] rounded-lg shadow-lg text-center shadow-box-shadow' onClick={(e) => e.stopPropagation()}>
            <CloseIcon className='relative left-[210px] top-[20px] max-sm:left-[150px]' onClick={props.close} />
                <h1 className='text-[30px] leading-8 mt-4'>{props.boxTitle}</h1>
                <span>{props.boxTagline}</span>
            <div className='flex flex-col gap-2 mt-5'>
                <Button clickedButton={() => onClickSignUp()} customClassName="not-login-action-sign-up-button" buttonType="button" label="Sign-up" />
                <Button clickedButton={() => onClickLogin()} customClassName="not-login-action-login-button" buttonType="button" label="Login (Demo Account Inside)" />
            </div>
        </div>
    </div>
  )
}

export default NotLoginAction