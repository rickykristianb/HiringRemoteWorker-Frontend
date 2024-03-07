import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../Button'
import AuthContext from '../../Context/AuthContext'
import AlertNotification from '../AlertNotification'
// import CustomCKEditor from './CustomCKEditor'

const SendMessage = (props) => {

  let {authToken} = useContext(AuthContext)
  let userToken = authToken.access

  const [alertResponse, setAlertResponse] = useState()
  const [editorData, setEditorData] = useState('');

  const handleEditorChange = newData => {
      setEditorData(newData);
  }

  const {register, handleSubmit, setError, reset,
    formState: {
      errors, isSubmitting, isSubmitSuccessful
    }} = useForm({
      defaultValues: {
        "to_user": props.recipient ? props.recipient : "",
        "subject": "",
        "message_body": "",
      }
    })

    const onSendMessage = async(data) => {
      const response = await fetch("/api/message/send_message/", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${userToken}`
        },
        body: JSON.stringify(data)
      })
      const responseData = await response.json()
      if (response.status === 201){
        setAlertResponse(responseData)
        reset()
      } else {
        setAlertResponse(responseData)
      }
    }
  return (
    <div className='flex flex-col gap-5'>
      <h4 className='font-bold text-xl leading-10 max-md:mt-[150px] max-md:pl-4'>New Message</h4>
      <form onSubmit={handleSubmit(onSendMessage)} className='flex flex-col gap-3 max-md:px-4'>
        <div className='to_user'>
          <input {...register("to_user", {
              required: "Please specify recipient.", 
              pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Please Insert Correct Email"
              }})} className="w-full h-8 text-base border border-slate-dark-basic pl-2 focus:outline-none max-md:h-10" placeholder='Recipient' disabled={ isSubmitting }/>
          {errors.to_user && <span className='error-field'>{errors.to_user.message}</span>}
        </div>
        <div className='subject'>
          <input {...register("subject", {required: "Please specify your message subject"})} className="w-full h-8 text-base border border-slate-dark-basic pl-2 focus:outline-none max-md:h-10" placeholder='Subject' disabled={ isSubmitting }/>
          {errors.subject && <span className='error-field'>{errors.subject.message}</span>}
        </div>
        <div className='subject'>
          <textarea {...register("message_body", {required: "Please specify your message subject"})} rows="20" className="w-full text-base border border-slate-dark-basic pl-2 focus:outline-none max-md:h-[250px]" placeholder='Message' disabled={ isSubmitting }/>
          {errors.message_body && <span className='error-field'>{errors.message_body.message}</span>}
        </div>
        <Button label={isSubmitting ? "Sending..." : "Send"} buttonType="input" />
      </form>
      <AlertNotification alertData={alertResponse}/>
    </div>
  )
}

export default SendMessage;