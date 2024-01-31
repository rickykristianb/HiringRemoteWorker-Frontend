import React, { useEffect, useState } from 'react'
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailIcon from '@mui/icons-material/Mail';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import CompanyLoginAction from './CompanyLoginAction';
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
        <div className='flex justify-evenly w-full max-sm:flex-wrap py-10'>
            <div className='flex flex-col p-5 pt-0 pl-0'>
                <p className='text-2xl font-bold'>Interested with this project?</p>
                <br />
                <ul className='flex flex-col gap-4'>
                    <li>
                        <a href="tel:6282168897862" target='blank'>
                            <div className='flex gap-4'>
                                <PhoneIcon sx={{ fontSize: 30, color: "#4e6e81" }} />
                                +6282168897862
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="https://api.whatsapp.com/send?phone=6282168897862" target='blank'>
                            <div className='flex gap-4'>
                                <WhatsAppIcon sx={{ fontSize: 30, color: "#4e6e81" }} />
                                +6282168897862
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="mailto:contact@rickykristianbutarbutar.com" target='blank'>
                            <div className='flex gap-4'>
                                <MailIcon sx={{ fontSize: 30, color: "#4e6e81" }} />
                                contact@rickykristianbutarbutar.com
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
            <div className='flex items-center justify-center'>
                <div className='max-lg:w-screen px-6 max-sm:mt-10 items-center'>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <label>Name </label><br />
                        <input {...register("name", {required: "Name is required"})} className="w-[450px] h-6 max-sm:w-full mb-2 outline-none" ></input><br />
                        {errors.name && <span className='error-field' >{errors.name.message}</span>}
                        <br className={!errors.name?.message && "hidden"} />
                        <label>Email</label><br />
                        <input {...register("email", {
                            required: "Email is required", 
                            pattern: {
                                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Please Insert Correct Email"
                            }})} className="w-[450px] h-6  max-sm:w-full mb-2 outline-none" ></input><br />
                        {errors.email && <span className='error-field'>{errors.email.message}<br /></span>}
                        <br className={!errors.name?.message && "hidden"} />
                        <label>Message</label><br />
                        <textarea {...register("messageBody", {required: "Message is required"})} rows="10" className="w-[450px] max-sm:w-full outline-none" ></textarea><br />
                        {errors.messageBody && <span className='error-field'>{errors.messageBody.message}</span>}
                        <Button buttonType="input" label={ isSubmitting ? "Sending..." : "Send Message"} disabled={isSubmitting ? true : false} />
                        { alert && <AlertNotification alertData={alert} />}
                    </form>
                </div>
            </div>
        </div>
        <div className='flex justify-center mt-12 bg-white w-full items-center py-3'>
            <div>
                <p>© Ricky Kristian Butar Butar</p>
            </div>
        </div>
        <CompanyLoginAction />
    </div>
  )
}

export default Footer
