import React, { useContext, useEffect, useState } from 'react'
import Divider from '@mui/material/Divider';
import { useForm } from "react-hook-form";
import AlertNotification from '../components/AlertNotification';
import Button from '../components/Button';
import AuthContext from '../Context/AuthContext';
import { Navigate, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NewPassword = (match) => {
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState()
    const [passwordHide, setPasswordHide] = useState(true);
    const [password, setPassword] = useState()
    const [retypePassword, setRetypePassword] = useState(null)
    const [retypePasswordHide, setRetypePasswordHide] = useState(true)
    const [navigation, setNavigation] = useState(false)
    const [alertField, setAlertField] = useState()
    const { uid, token } = useParams()

    const [userid, setUserid] = useState("")
    const [userToken, setUserToken] = useState("")

    useEffect(() => {
      setUserid(uid)
      setUserToken(token)
    }, [uid, token])
    

    const navigate = useNavigate()

    const {register, handleSubmit, reset,
        formState: {
          errors, isSubmitting, isSubmitSuccessful
        }} = useForm({
          defaultValues: {
            "new_password": "",
            "re_new_password": ""
          }
        })
    
    const onClickPasswordIcon = () => {
        setPasswordHide(!passwordHide);
    }

    const onClickRetypePasswordHide = () => {
        setRetypePasswordHide(!retypePasswordHide)
    }

    const onSubmit = async (e) => {
      if (e.new_password === e.re_new_password){
        let response = await fetch(`/api/user/accounts/reset_password_confirm`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            "uid": uid,
            "token": token,
            "new_password": e.new_password,
            "re_new_password": e.re_new_password,
          })
        })
        setAlert({
          "success": "New password has been saved. We'll redirect you to login page"
        })
        setAlertField()
        setNavigation(true)
      } else {
        setAlertField("Password and retype password do not match")
      }
    }

    useEffect(() => {
      if (navigation){
        let timeout = setTimeout(() => {
          navigate("/login/")
        }, 5000);
        return () => clearTimeout(timeout)
      }      
    }, [navigation, navigate]);

    const newPasswordOnChange = (e) => {
      setPassword(e.target.value)
      
      if (retypePassword === null  || retypePassword === ""){
        setAlertField()
      } else if (e.target.value !== retypePassword){
        setAlertField("Password and retype password do not match")
      } else if (e.target.value == retypePassword){
        setAlertField()
      } else if (e.target.value === ""){
        setAlertField()
      } 
    }

    const retypePasswordOnChange = (e) => {
      setRetypePassword(e.target.value)

      if (e.target.value !== password){
        setAlertField("Password and retype password do not match")
      } else if (e.target.value == password){
        setAlertField()
      } else if (e.target.value === ""){
        setAlertField()
      }
    }


  return (
    <div className='container-login-reset-password-register'>
        <div className='container-login-for-container-reset-password-form-container-register-form'>
            <div className='self-center mb-6'>
              <p>NEW PASSWORD</p>
            </div>
            <Divider />
            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-2'>
                    <label>New Password</label>
                    <div className='password-input'>
                      <input {...register("new_password", {required: "New Password is required"})} className="password-input-field" onChange={(e) => newPasswordOnChange(e)} type={ passwordHide ? 'password' : "text"} disabled={ isSubmitting } />
                      <div className='eye-icon'>
                        {!passwordHide ? 
                          <i class="fa-solid fa-eye fa-xl" onClick={onClickPasswordIcon}></i>
                          :
                          <i class="fa-solid fa-eye-slash fa-xl" onClick={onClickPasswordIcon}></i>
                        }
                      </div>    
                    </div>
                    {errors.new_password && <span className='error-field'>{errors.new_password.message}</span>}
                </div>
                

                <div className='flex flex-col gap-2'> 
                    <label>Retype New Password</label>
                    <div className='password-input'>
                      <input {...register("re_new_password", {required: "Retype new password is required"})} className="password-input-field" onChange={(e) => retypePasswordOnChange(e)} type={ retypePasswordHide ? "password" : "text"} disabled={ isSubmitting } value={ isSubmitSuccessful ? (!alertField ? reset() : null) : null }></input>
                      <div className='eye-icon'>
                        {!retypePasswordHide ? 
                        <i class="fa-solid fa-eye fa-xl" onClick={onClickRetypePasswordHide}></i>
                        :
                        <i class="fa-solid fa-eye-slash fa-xl" onClick={onClickRetypePasswordHide}></i>
                        }
                      </div>
                    </div>
                    {errors.re_new_password && <span className='error-field'>{errors.re_new_password.message}</span>}
                    {alertField && <span className='error-field'>{alertField}</span>}
        
                </div>
                <br />        
                <Button label={ isSubmitting ? "Saving" : "Save"} buttonType="input" disabled={isSubmitting ? true : false} />
                { alert && <AlertNotification alertData={alert} />}
            </form>
        </div>
    </div>
  )
}

export default NewPassword