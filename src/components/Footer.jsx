import React, { useEffect, useState } from 'react'
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailIcon from '@mui/icons-material/Mail';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useForm } from "react-hook-form";

import AlertNotification from './AlertNotification';
import Button from './Button';


const Footer = () => {

    const [alert, setAlert] = useState(null);

    const { register, handleSubmit, setError, reset, formState, formState: {
        isDirty, dirtyFields, errors, isValid, isSubmitSuccessful, isSubmitting
    }} = useForm({
        mode: "onChange",
        defaultValues:{
            name: "",
            email: "",
            messageBody: ""
        }
    });

    const onSubmit = async (data, e) => {
        e.preventDefault();
        
        const messageBodyField = document.getElementsByClassName("sendEmailTextArea")[0];
        messageBodyField.disabled = true;

        const sendMessageField = document.getElementsByClassName("sendEmailInput");
        for (let i=0; i < sendMessageField.length; i++){
            sendMessageField[i].disabled = true;
        }
        
        if (formState.isValid){
            try{
                const response = await fetch("/api/message/send_email/", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(data)
                })
                if (response.ok){
                    const responseData = await response.json();
                    setAlert(responseData)
                    reset();
                }               
            } catch (error) {
                console.log(error)
            }
            // set disabled = false for input
            messageBodyField.disabled = false;
            for (let i=0; i < sendMessageField.length; i++){
                sendMessageField[i].disabled = false;
            }
        }
    }

  return (
    <div className='container-footer'>
        <div className='container-contact-message'>
            <div className='container-contact-info'>
                <div>
                    <h2>Interested with this project?</h2>
                    <ul>
                        <li className='footer-info'>
                            <a href="tel:6282168897862" target='blank'>
                                <div className='footer-info'>
                                    <PhoneIcon sx={{ fontSize: 30, color: "#4e6e81" }} />
                                    <span> +6282168897862</span>
                                </div>
                            </a>
                        </li>
                        <li className='footer-info'>
                            <a href="https://api.whatsapp.com/send?phone=6282168897862" target='blank'>
                                <div className='footer-info'>
                                    <WhatsAppIcon sx={{ fontSize: 30, color: "#4e6e81" }} />
                                    <span> +6282168897862</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="mailto:contact@rickykristianbutarbutar.com" target='blank'>
                                <div className='footer-info'>
                                    <MailIcon sx={{ fontSize: 30, color: "#4e6e81" }} />
                                    <span>contact@rickykristianbutarbutar.com</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <ul className='social-media'>
                                <li><a href="https://github.com/rickykristianb" target='blank'><GitHubIcon sx={{ fontSize: 30, color: "#4e6e81" }} /></a></li>
                                <li><a href="https://www.linkedin.com/in/rickykbb/" target='blank'><LinkedInIcon sx={{ fontSize: 30, color: "#4e6e81" }} /></a></li>
                                <li><a href="https://www.instagram.com/rickykrisb/" target="blank"><InstagramIcon sx={{ fontSize: 30, color: "#4e6e81" }} /></a></li>
                            </ul>
                        </li>
                    </ul> 
                </div>      
            </div>
            <div className='container-send-message'>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label>Name </label><br />
                        <input {...register("name", {required: "Name is required"})} className="sendEmailInput" ></input><br />
                        {errors.name && <span className='error-field' >{errors.name.message}</span>}
                        <br />
                        <label>Email</label><br />
                        <input {...register("email", {
                            required: "Email is required", 
                            pattern: {
                                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Please Insert Correct Email"
                            }})} className="sendEmailInput" ></input><br />
                        {errors.email && <span className='error-field'>{errors.email.message}</span>}
                        <br />
                        <label>Message</label><br />
                        <textarea {...register("messageBody", {required: "Message is required"})} rows="10" className="sendEmailTextArea" ></textarea><br />
                        {errors.messageBody && <span className='error-field'>{errors.messageBody.message}</span>}
                        <br />
                        <br />
                        <Button buttonType="input" label={ isSubmitting ? "Sending..." : "Send Message"} disabled={isSubmitting ? true : false} />
                        { alert && <AlertNotification alertData={alert} />}
                    </form>
                </div>
            </div>
        </div>
        <div className='container-creator'>
            <div>
                <p>© Ricky Kristian Butar Butar</p>
            </div>
        </div>
    </div>
  )
}

export default Footer