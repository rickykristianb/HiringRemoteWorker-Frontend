import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

const ReplyMessage = (props) => {
  const location = useLocation()
  const { replyData } = location.state
  
  const {register, handleSubmit, setError, reset,
    formState: {
      errors, isSubmitting, isSubmitSuccessful
    }} = useForm({
      defaultValues: {
        "message_body": "",
      }
    })


  return (
    <div>
        <form onSubmit={handleSubmit("")}>
          <textarea {...register("message_body", {required: "Please specify your message subject"})} rows="30" className="send-message-input" placeholder='Messssage' disabled={ isSubmitting }/> */}
          {errors.message_body && <span className='error-field'>{errors.message_body.message}</span>}
        </form>
    </div>
  )
}

export default ReplyMessage