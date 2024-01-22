import React, { useContext, useState } from 'react'
import Button from 'components/Button'
import { useForm } from 'react-hook-form'
import AuthContext from 'Context/AuthContext'
import CloseIcon from '@mui/icons-material/Close';
import AlertNotification from 'components/AlertNotification';

const AddExperience = (props) => {

  const [experience, setExperience] = useState([])
  const [disableEndDate, setDisableEndData] = useState(true)

  const {register, handleSubmit, reset,
    formState: {
      errors, isSubmitting
    }} = useForm({
      defaultValues: {
        "id": "",
        "companyName": "",
        "jobTitle": "",
        "jobStartDate": null,
        "jobEndDate": null,
        "jobDescription": "",
      }
    })

    let userAuthToken
    let { authToken } = useContext(AuthContext)
    if (authToken){
        userAuthToken = authToken.access
    }

    const onAddExperience = async (index) => {
      console.log(experience);
      try{
        const response = await fetch("/api/user/add_experience/",{
          method: "POST",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userAuthToken}`
          },
          body: JSON.stringify(experience)
        })
        let data = await response.json()

        if (response.status === 201) {
          const newExperience = {
            ...experience,
            id: data.id
          }
          props.setExperienceList((prevExperienceList) => ([
            ...prevExperienceList,
            newExperience
          ]));
          props.setAlertResponse({"success": data.success})
          setDisableEndData(true)
          reset()
          document.body.classList.remove("disable-scroll");
        } else {
          props.setAlertResponse({"error": data.error})
        }
      }catch(errors){
        props.setAlertResponse({"error": errors})
      } finally{
        props.close()
      }
    }

    const onChangeExperience = (e, index) => {
      const {name, value} = e.target
      console.log(name, value);
      setExperience((prevExperience) => {
          return {
            ...prevExperience,
            [name]: value
          }
      })
    }
    
    const onDisableEndDate = (index) => {
      setDisableEndData(!disableEndDate)

      if (disableEndDate){
        setExperience({
          "id": "",
          "companyName": experience.companyName,
          "jobTitle": experience.jobTitle,
          "jobStartDate": experience.jobStartDate,
          "jobDescription": experience.jobDescription
        })
      }
    }

  return (
    <>
      <form onSubmit={handleSubmit(onAddExperience)} className='experience-form'>
        <CloseIcon className='addExperience-close-button' onClick={props.close} />
        <input {...register ("companyName", {"required": "Company Name is required"})}
          value={experience.companyName}
          onChange={(e) => onChangeExperience(e)}
          className='experience-input-field' 
          placeholder='Company'
          disabled={isSubmitting ? true : false}
        ></input>
        {errors.companyName && <span className='error-field'>{errors.companyName.message}</span>}
        <input {...register ("jobTitle", {"required": "Job Title is required"})}
          value={experience.jobTitle}
          onChange={(e) => onChangeExperience(e)}
          className='experience-input-field' 
          placeholder='Job Title'
          disabled={isSubmitting ? true : false}
        ></input>
        {errors.jobTitle && <span className='error-field'>{errors.jobTitle.message}</span>}
        <div className='experience-date'>
          <div className='experience-startend-date'>
            <label>Start</label>
            <input {...register("jobStartDate", {"required": "Start date is required"})}
              value={experience.jobStartDate}
              onChange={(e) => onChangeExperience(e)}
              type="date" 
              id="since-date" 
              name="jobStartDate" 
              className='input-field-experience-startend-date'
              disabled={isSubmitting ? true : false}
            ></input>
            {errors.jobStartDate && <span className='error-field'>{errors.jobStartDate.message}</span>}
          </div>
          {disableEndDate && 
            <div className='experience-startend-date'>
              <label>End</label>  
              <input {...register("jobEndDate", !disableEndDate ? "" : {"required": "End date is required"})}
                value={!disableEndDate ? "9999-12-31" : experience.jobEndDate}
                onChange={(e) => onChangeExperience(e)}
                type="date"
                id="end-date"
                name="jobEndDate"
                className='input-field-experience-startend-date'
                disabled={isSubmitting ? true : false}
              ></input>
              {errors.jobEndDate && <span className='error-field'>{errors.jobEndDate.message}</span>}
            </div>
          }
          <div className='checkbox-input'>
            <input type="checkbox" name="task1" onClick={onDisableEndDate}></input><label>Still Working</label>
          </div>
        </div>
        <textarea {...register ("jobDescription")}
          value={experience.jobDescription}
          onChange={(e) => onChangeExperience(e)}
          className='experience-textArea' 
          rows="30" 
          placeholder='Job Description'
          disabled={isSubmitting ? true : false}
        ></textarea>
        <Button buttonType="input" label={isSubmitting ? "Saving..." : "Add"} />
      </form> 
    </>      
  )
}

export default AddExperience