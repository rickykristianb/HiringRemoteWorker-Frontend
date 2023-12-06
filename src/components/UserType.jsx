import React from 'react'
import Button from './Button'
import { useForm } from 'react-hook-form'

const UserType = () => {

    const {register, handleSubmit, reset,
        formState: {
          errors, isSubmitting
        }} = useForm({
          defaultValues: {
            "choice1": "",
            "choice2": "",
          }
        })

  return (
    <div className='container-user-type'>
        <div className='user-type-header'>
            <p>Are you looking for..</p>
        </div>
        <div className='user-type-selection'>
            <input {...register("choice1", {required: "Password is required"})} 
                id="option1"
                type="radio"
                value="Job"
                name="choice"
                className="login-input" 
                disabled={ isSubmitting ? true : false } />
            <label for="option1" class="button-label">Job</label>
            <input {...register("choice2", {required: "Password is required"})} 
                id="option2"
                type="radio"
                value="Candidate"
                name="choice"
                className="login-input" 
                disabled={ isSubmitting ? true : false } />
            <label for="option2" class="button-label">Candidate</label>
        </div>
        {/* <Button label={ isSubmitting ? "Saving" : "Save"} buttonType="input" disabled={isSubmitting ? true : false} />
        { alert && <AlertNotification alertData={alert} />} */}
    </div>
  )
}

export default UserType