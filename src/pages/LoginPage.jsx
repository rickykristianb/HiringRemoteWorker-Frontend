import React, { useContext, useState } from 'react'
import { useForm } from "react-hook-form";
import Divider from '@mui/material/Divider';
import AlertNotification from '../components/AlertNotification';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import AuthContext from '../Context/AuthContext';
import DemoAccountInfo from 'components/DemoAccountInfo';
import GoogleOauthLogin from 'components/GoogleOauthLogin';

const LoginPage = () => {

  const [passwordHide, setPasswordHide] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const onClickPasswordIcon = () => {
    setPasswordHide(!passwordHide);
  }

  const {register, handleSubmit, reset,
    formState: {
      errors, isSubmitting
    }} = useForm({
      defaultValues: {
        "email": "",
        "password": "",
      }
    })

  let { loginUser, alert } = useContext(AuthContext)


  return (
    <div className='container-login-reset-password-register'>
      <div className='container-login-for-container-reset-password-form-container-register-form'>
        <div className='self-center mb-6'>
          <p>LOGIN</p>
        </div>
        <Divider />
        <form onSubmit={handleSubmit(loginUser)} className='form-container-login-reset-password-register'>
          <div className='container-username'>
            <label>Email</label>
            <input {...register("email", {required: "Email is required"})} className="login-input" disabled={ isSubmitting }/>
            {errors.email && <span className='error-field'>{errors.email.message}</span>}
          </div>
          <div className='container-password'>
            <label>Password</label>
            <div className='password-input'>
              <input {...register("password", {required: "Password is required"})} className="password-input-field" type={ passwordHide ? 'password' : "text"} disabled={ isSubmitting } />
              <div className='eye-icon'>
                {!passwordHide ? 
                  <i class="fa-solid fa-eye fa-xl" onClick={onClickPasswordIcon}></i>
                  :
                  <i class="fa-solid fa-eye-slash fa-xl" onClick={onClickPasswordIcon}></i>
                }
              </div>
                         
            </div>
            {errors.password && <span className='error-field'>{errors.password.message}</span>}
          </div>   
          <Button label={ isSubmitting ? "Login..." : "Login"} buttonType="input" disabled={isSubmitting ? true : false} />
          { alert && <AlertNotification alertData={alert} />}
        </form>
        <Link to={"/reset-password/"} className='self-end py-4'>
          <p>Forget Password? </p>
        </Link>
        <div className='w-full flex justify-center mt-2 mb-6'>
          <GoogleOauthLogin label={"Sign in with Google"} />
        </div>
        <Divider />
        <div className='flex justify-center mt-4 flex-col items-center gap-4'>
          <p>Don't have account yet?</p>
          <Link to={"/register/"}>
            <Button buttonType="button" label="Sign-Up" />
          </Link>
        </div>
      </div>
      <DemoAccountInfo />
    </div>
  )
}

export default LoginPage