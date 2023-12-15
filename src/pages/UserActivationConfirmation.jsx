import React, { useEffect, useCallback, useState, useContext, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import AlertNotification from '../components/AlertNotification'
import { useForm } from 'react-hook-form'
import AuthContext from '../Context/AuthContext'

const UserActivationConfirmation = () => {

    const { uid, token } = useParams()
    const [ buttonLabel, setButtonLabel ] = useState("Activate")
    const [ alert, setAlert ] = useState()
    const [ resendActivate, setResendActivate ] = useState(false)
    
    // const [ activationSuccess, setActivationSuccess] = useState()

    let { resendActivationLink, resendLoading, resendActivationAlert } = useContext(AuthContext)

    const navigate = useNavigate()

    const {register, handleSubmit, setError, reset,
        formState: {
          errors, isSubmitting, isSubmitSuccessful
        }} = useForm({
          defaultValues: {
            "email": "",
          }
        })

    const onResendActivation = async (e) => {
        await resendActivationLink(e.email)
    }

    const activationSuccess = useRef(false)

    const navigateToLogin = () => {
        return setTimeout(() => {
          navigate("/login/");
        }, 5000);
    };
            
    useEffect(() => {
        console.log("MASUK USE EFFECT")
        console.log(activationSuccess.current);
        if (activationSuccess.current) {
            console.log("BENAR NIH")
            const timeoutId = setTimeout(() => {
                navigate("/login/");
              }, 5000);

            return () => clearTimeout(timeoutId);
        }
        activationSuccess.current = false
    }, [activationSuccess.current]);


    const sendActivationConfirmation = async () => {
        
        setButtonLabel("Activating ...")
        try {
            let response = await fetch("/auth/users/activation/", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    "uid": uid,
                    "token": token
                })
            });

            console.log(response);
            if (response.ok){
                setAlert({
                    success: "You account has been activated. We'll redirect you to login page in 5 seconds",
                })
                console.log("MASUK SINI");
                activationSuccess.current = true
                console.log(activationSuccess.current);
                
            } else if (response.status === 403){
                setAlert({
                    error: "This link is expired, please generate new activation link"
                })
            } else if (response.status === 400){
                setAlert({
                    error: "Bad Request, user maybe accidentally deleted."
                })
            }      
        } catch (error) {
            if (error.name ==="SyntaxError" && error.message.includes("Unexpected end of JSON input")) {
                console.error("Truncated data: Not all of the JSON data was received");
                } else {
                console.error(error);
            }
        } finally {
            setButtonLabel("Activate")
        }
        console.log(activationSuccess.current);
    }

  return (
    <div className='container-user-activation'>
        <div className='activation-confirmation'>
            <p>Please click this button below to activate your account.</p>
            <Button buttonType="button" label={buttonLabel} clickedButton={sendActivationConfirmation} />
            <br />
            <p onClick={() => setResendActivate(true)} style={{textDecoration: "underline"}}>Resend Activation?</p>
            {resendActivate && 
            <div className='resend-activation-input'>
                <form onSubmit={handleSubmit(onResendActivation)}>
                    <input {...register("email", {"required": "Email is required", 
                    "pattern": {
                        "value": /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        "message": "Please Insert Correct Email"
                    }})} className="login-input" placeholder='Email'></input>
                    <br />
                    {errors.email && <span className='error-field'>{errors.email.message}</span>}
                    <br />
                    <Button buttonType="input" label={resendLoading ? "Sending ..." : "Resend"}/>
                </form>
            </div>
            }
        </div>
        {/* Alert for resend activation */}
        {resendActivationAlert && <AlertNotification alertData={resendActivationAlert}/>}  
        {/* Alert for sending activation */}
        {alert && <AlertNotification alertData={alert}/>}
    </div>
  )
}

export default UserActivationConfirmation