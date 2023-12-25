import React, { useContext, useState } from 'react'
import Divider from '@mui/material/Divider';
import { useForm } from "react-hook-form";
import AlertNotification from '../components/AlertNotification';
import Button from '../components/Button';
import AuthContext from '../Context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {

    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState()
    const [resendActivationEmail, setResendActivationEmail] = useState("")
    const [activateResendActivationEmailButton, setActivateResendActivationEmailButton] = useState(false)
    const navigate = useNavigate()

    let { resendActivationLink } = useContext(AuthContext)

    const {register, handleSubmit, reset,
        formState: {
          errors, isSubmitting, isSubmitSuccessful
        }} = useForm({
          defaultValues: {
            "email": ""
          }
        })

    const resetPassword = async (e) => {
      try {
        const response = await fetch("/auth/users/reset_password/", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            "email": e.email
          })
        })
        console.log(response);
        console.log(response.statusText);
        if (response.ok){
          setAlert({
            "success": `Reset link has been sent to your email. Please check ${e.email}`
          })
        } 
      } catch (error){
        setAlert({
          "error": error
        })
      }
    }
  

  return (
    <div className='container-resetpassword'>
        <div className='container-resetpassword-form'>
            <div className='resetpassword-form-header'>
            <p>RESET PASSWORD</p>
            </div>
            <Divider />
            <form onSubmit={handleSubmit(resetPassword)}>
                <label>Email</label>
                <input {...register("email", {required: "Email is required", "pattern" :{
                  "value": /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  "message": "Please Insert Correct Email"
                }})} className="reset-password-input" disabled={ isSubmitting } value={ isSubmitSuccessful ? reset() : null}></input>
                {errors.email && <span className='error-field'>{errors.email.message}</span>}
                <Button label={ isSubmitting ? "Sending Link" : "Reset"} buttonType="input" disabled={isSubmitting ? true : false} />
                { alert && <AlertNotification alertData={alert} />}
            </form>
            {activateResendActivationEmailButton && 
            <Button buttonType="button" className={"button"} label="Resend Activation" clickedButton={resendActivationLink(resendActivationEmail)} />
            }
            
        </div>
    </div>
  )
}

export default ResetPassword