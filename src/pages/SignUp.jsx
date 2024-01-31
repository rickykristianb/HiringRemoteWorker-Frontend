import React, { useContext, useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import Divider from '@mui/material/Divider';
import AlertNotification from '../components/AlertNotification';
import Button from '../components/Button';
import AuthContext from '../Context/AuthContext';

const SignUp = () => {
  const [passwordHide, setPasswordHide] = useState(true);
  const [RePasswordHide, setRePasswordHide] = useState(true);
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState(null) // password field value
  const [rePassword, setRePassword] = useState(null) // re type password field value
  const [passwordMatch, setPasswordMatch] = useState(true)  // alert for password type

  let { 
    alert, 
    userRegistration, 
    passwordError, 
    rePasswordError,
    successRegistration,
    resendActivationLink,
    resendActivationAlert } = useContext(AuthContext)
  
  const onClickPasswordIcon = () => {
    setPasswordHide(!passwordHide);
  }

  const onClickRePasswordIcon = () => {
    setRePasswordHide(!RePasswordHide);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const onChangeRePassword = (e) => {
    setRePassword(e.target.value)
  }

  useEffect(() => {
    if (rePassword !== null){
      if (password !== rePassword){
        setPasswordMatch(false)
      } else {
        setPasswordMatch(true)
      }
    }
  }, [password, rePassword])

  const {register, handleSubmit, reset,
    formState: {
      errors, isSubmitting
    }} = useForm({
      defaultValues: {
        "username": "",
        "name": "",
        "email": "",
        "password": "",
        "re_password": "",
        "user_type": ""
      }
    })

    const onResendActivationClick = async () => {
        setLoading(true);
        await resendActivationLink()
        setLoading(false)
    }

    const submitRegistration = async (e) => {
      console.log(e);
      if (passwordMatch) {
        try{
          await userRegistration(e)
            if (successRegistration.current){
              console.log("REGISTRASI SUKSES STATUS: ",successRegistration)
              reset()
            }
        } catch(error){
          console.log("ERROR", error);
        }
      }
    }
  
  return (
    <div className='container-login-reset-password-register'>
      <div className='container-login-for-container-reset-password-form-container-register-form'>
        <div className='self-center mb-6'>
          <p>SIGN UP</p>
        </div>
        <Divider />
        <form onSubmit={handleSubmit(submitRegistration)} className='form-container-login-reset-password-register'>
          <div className='container-username'>
            <label>Username</label>
            <input {...register("username", {required: "Username is required", "pattern": {
              "value":/^[a-zA-Z0-9._-]{3,20}$/,
              "message": "Only letter and number, no space and other symbols"
            }})}
            className="login-input" disabled={ isSubmitting ? true : false } />
            {errors.username && <span className='error-field'>{errors.username.message}</span>}
          </div>
          <div className='container-fullname'>
            <label>Full Name</label>
            <input {...register("name", {required: "Full name is required"})} className="login-input" disabled={ isSubmitting ? true : false  } />
            {errors.name && <span className='error-field'>{errors.name.message}</span>}
          </div>
          <div className='container-email'>
            <label>Email</label>
            <input {...register("email", {
              required: "Email is required", 
              "pattern": { 
                "value": /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                "message": "Please Insert Correct Email"
              }})} className="login-input" disabled={ isSubmitting ? true : false  } />
            {errors.email && <span className='error-field'>{errors.email.message}</span>}
          </div>
          <div className='container-password'>
            <label>Password</label>
            <div className='password-input'>
              <input {...register("password", {required: "Password is required"})} 
                  className="password-input-field" 
                  type={ passwordHide ? 'password' : "text"}
                  onChange={onChangePassword}
                  disabled={ isSubmitting ? true : false  } />
              <div className='eye-icon'>
                {!passwordHide ? 
                  <i class="fa-solid fa-eye fa-xl" onClick={onClickPasswordIcon}></i>
                  :
                  <i class="fa-solid fa-eye-slash fa-xl" onClick={onClickPasswordIcon}></i>
                }
              </div>
            </div>
            {errors.password && <span className='error-field'>{errors.password.message}</span>}
            { passwordError && passwordError.map((error, i) => {
              return <li className='error-field' key={i} >{error}</li>
            }) }
          </div>
          <div className='container-password'>
            <label>Retype Password</label>
            <div className='password-input'>
              <input {...register("re_password", {required: "Re_password is required"})} 
                className="password-input-field" 
                type={ RePasswordHide ? 'password' : "text"} 
                onChange={onChangeRePassword}
                disabled={ isSubmitting ? true : false  } />
              <div className='eye-icon'>
                {!RePasswordHide ? 
                  <i class="fa-solid fa-eye fa-xl" onClick={onClickRePasswordIcon}></i>
                  :
                  <i class="fa-solid fa-eye-slash fa-xl" onClick={onClickRePasswordIcon}></i>
                }
              </div>
            </div>
            {!passwordMatch && <span className='error-field'>Password did not match</span> }
            {errors.re_password && <span className='error-field'>{errors.re_password.message}</span>}
            { rePasswordError && rePasswordError.map((error, i) => {
              return <li className='error-field' key={i} >{error}</li>
            }) }
          </div>
          <div className='container-user-type'>
            <div>
                <p>Are you looking for..</p>
            </div>
            <div className='flex flex-row gap-2 mt-4'>
                <input {...register("user_type")} 
                    id="option1"
                    type="radio"
                    value="personal"
                    name="user_type"
                    
                    defaultChecked 
                    disabled={ isSubmitting ? true : false } />
                <label for="option1" class="button-label cursor-pointer bg-transparent border border-gray-300 text-dark-basic w-[190px] max-sm:w-[140px] transition-all duration-300 rounded-md py-2 px-4 inline-flex items-center justify-center hover:bg-dark-basic hover:text-white">Job</label>
                <input {...register("user_type")} 
                    id="option2"
                    type="radio"
                    value="company"
                    name="user_type"
                    disabled={ isSubmitting ? true : false } />
                <label for="option2" class="button-label cursor-pointer bg-transparent border border-gray-300 text-dark-basic w-[190px] max-sm:w-[140px] transition-all duration-300 rounded-md py-2 px-4 inline-flex items-center justify-center hover:bg-dark-basic hover:text-white">Candidate</label>
            </div>
        </div>
          <Button label={ isSubmitting ? "Sign-ing Up" : "Sign Up"} buttonType="input" disabled={isSubmitting ? true : false} />         
        </form> 
        { successRegistration.current 
        &&
        <div className='success-register-container'>
          <p>Registration successful, please check your email to activate your account before login!</p>
          <p>If you don't receive any activation link, please click Resend Activation button</p>
          <Button label={loading ? "Sending ..." : "Resend Activation"} buttonType="button" clickedButton={ onResendActivationClick } />
        </div>
        }    
      </div>
      { alert && <AlertNotification alertData={alert} />}
      { resendActivationAlert && <AlertNotification alertData={resendActivationAlert} />}
      
    </div>
  )
}

export default SignUp