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
    <div id='not-login-action-container' onClick={props.close}>
        <div id='not-location-action-layout' onClick={(e) => e.stopPropagation()}>
            <CloseIcon id='not-location-action-close-button' onClick={props.close} />
                <h1>{props.boxTitle}</h1>
                <span>{props.boxTagline}</span>
            <br />
            <Button clickedButton={() => onClickSignUp()} customClassName="not-login-action-sign-up-button" buttonType="button" label="Sign-up" />
            <Button clickedButton={() => onClickLogin()} customClassName="not-login-action-login-button" buttonType="button" label="Login (Demo Account Inside)" />
        </div>
    </div>
  )
}

export default NotLoginAction