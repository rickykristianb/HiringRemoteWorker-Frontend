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
    const [retypePasswordHide, setRetypePasswordHide] = useState(true)
    const [navigation, setNavigation] = useState(false)
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

    let onSubmit = async (e) => {
      console.log(e.new_password, e.re_new_password);
        let response = await fetch("http://127.0.0.1:8000/auth/users/reset_password_confirm/", {
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
        setNavigation(true)
    }

    useEffect(() => {
      if (navigation){
        let timeout = setTimeout(() => {
          navigate("/login/")
        }, 5000);
        return () => clearTimeout(timeout)
      }      
    }, [navigation, navigate]);


  return (
    <div className='container-resetpassword'>
        <div className='container-resetpassword-form'>
            <div className='resetpassword-form-header'>
            <p>NEW PASSWORD</p>
            </div>
            <Divider />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='new-password-field'>
                    <label>New Password</label>
                    <div className='password-input'>
                      <input {...register("new_password", {required: "New Password is required"})} className="password-input-field" type={ passwordHide ? 'password' : "text"} disabled={ isSubmitting } />
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
                

                <div className='retype-password-field'>
                    <label>Retype New Password</label>
                    <div className='password-input'>
                      <input {...register("re_new_password", {required: "Retype new password is required"})} className="password-input-field" type={ retypePasswordHide ? "password" : "text"} disabled={ isSubmitting } value={ isSubmitSuccessful ? reset() : null}></input>
                      <div className='eye-icon'>
                        {!retypePasswordHide ? 
                        <i class="fa-solid fa-eye fa-xl" onClick={onClickRetypePasswordHide}></i>
                        :
                        <i class="fa-solid fa-eye-slash fa-xl" onClick={onClickRetypePasswordHide}></i>
                        }
                      </div>
                    </div>
                    {errors.re_new_password && <span className='error-field'>{errors.re_new_password.message}</span>}
        
                </div>              
                <Button label={ isSubmitting ? "Saving" : "Save"} buttonType="input" disabled={isSubmitting ? true : false} />
                { alert && <AlertNotification alertData={alert} />}
            </form>
        </div>
    </div>
  )
}

export default NewPassword