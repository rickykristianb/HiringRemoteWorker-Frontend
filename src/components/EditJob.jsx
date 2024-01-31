import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Divider } from '@mui/material'
import Select from "react-select";
import Button from './Button';
import AuthContext from 'Context/AuthContext';
import Backdrop from 'components/Backdrop';

const EditJob = (props) => {

  let userAuthToken
  let { authToken } = useContext(AuthContext)
  if (authToken){
    userAuthToken = authToken.access
  } 

  const period = ["Year", "Month", "Hour"]
  const experienceList = [
    "1 - 2 years", "2 - 4 years", "4 - 6 years", "6 - 8 years", "8 - 10 years", " > 10 years"
  ]
  const jobStatus = [ "Open", "Closed", "Finished"]
  const [alertResponse, setAlertResponse] = useState()
  const [loadedLocation, setLoadedLocation] = useState([])
  const [employmentTypeList, setEmploymentTypeList] = useState([])
  const [skillList, setSkillList] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobTitleAlertField, setJobTitleAlertField] = useState()
  const [jobDetailAlertField, setJobDetailAlertField] = useState()
  const [jobSkillAlertField, setJobSkillAlertField] = useState()
  const [jobLocationAlertField, setJobLocationAlertField] = useState()
  const [jobEmploymentTypeAlertField, setJobEmploymentTypeAlertField] = useState()
  const [jobSalaryAlertField, setJobSalaryAlertField] = useState()
  const [jobExperienceLevelAlertField, setJobExperienceLevelAlertField] = useState()
  const [deadlineAlertField, setDeadlineAlertField] = useState()
  const [editData, setEditData] = useState([])
  const [inputValue, setInputValue] = useState({
    jobStatus: "",
    jobTitle: "",
    jobDetail: "",
    jobSkills: [],
    jobLocation: [],
    jobEmploymentType: [],
    jobSalary: "",
    jobSalaryPaidPeriod: "",
    experienceLevel: "",
    jobDeadline: ""
  });

  const onLoadEditData = async() => {
    setInputValue({
        jobStatus: props.editData["data"].jobStatus,
        jobTitle: props.editData["data"].jobTitle,
        jobDetail: props.editData["data"].jobDetail,
        jobSkills: props.editData["data"].skills,
        jobLocation: props.editData["data"].jobLocation,
        jobEmploymentType: props.editData["data"].jobEmploymentType,
        jobSalary: props.editData["data"].jobSalary.nominal,
        jobSalaryPaidPeriod: props.editData["data"].jobSalary.paid_period,
        jobExperienceLevel: props.editData["data"].jobExperienceLevel,
        jobDeadline: props.editData["data"].jobDeadline
    })
  }

  const onLoadLocation = async() => {
    // get location list as an select option
    const response = await fetch("/api/user/get_location/", {
        method: "GET",
        headers: {
            "content-type": "application/json"
        }
    })
    const data = await response.json()
    setLoadedLocation(data)
  }

  const onLoadListEmploymentType = async() => {
    const response = await fetch("/api/user/get_emp_type/", {
        method: "GET",
        headers: {
            "content-type": "application/json"
        }
    })

    const data = await response.json()
    if (response.status === 200){

        const dataList = data.map((item) => {
            return {
                id : item.id,
                type: item.type
            }
        })
        setEmploymentTypeList(dataList)
    }
  }

  const onLoadSkills = async() => {
    const response = await fetch("/api/user/get_skills/",{
        method: "GET",
    })
    const data = await response.json()
    if (response.status === 200){
        setSkillList(data)
    }
  }

  const settingMinimumDateDatelineSelection = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const deadlineInput = document.getElementById('deadlineInput');
    
    if (deadlineInput) {
      deadlineInput.min = currentDate;
    }
  };

  useEffect( () => {
    onLoadEditData()
    onLoadLocation()
    onLoadListEmploymentType()
    onLoadSkills()

    settingMinimumDateDatelineSelection()
  }, [])

  const onCheckChangeInput = (name) => {

    switch(name){
      case "jobTitle":
        setJobTitleAlertField();
        break;
      case "jobDetail":
        setJobDetailAlertField();
        break;
      case "jobSkills":
        setJobSkillAlertField();
        break;
      case "jobLocation":
        setJobLocationAlertField();
        break;
      case "jobEmploymentType":
        setJobEmploymentTypeAlertField();
        break;
      case "jobSalary":
        setJobSalaryAlertField();
        break;
      case "jobSalaryPaidPeriod":
        setJobSalaryAlertField();
        break;
      case "experienceLevel":
        setJobExperienceLevelAlertField();
        break;
      case "jobDeadline":
        setDeadlineAlertField();
        break;
    }
    return true
  }

  const onChangeInputField = (e) => {
    const {name, value} = e.target
    onCheckChangeInput(name)

    setInputValue((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
     })
  }

  const onChangeSelectField = (name, value) => {
    onCheckChangeInput(name)
    if (name === "jobStatus"){
      value = value.value
    } else if (name === "jobSkills"){
        value = value.map((item) => {
            return {
                skill: {
                    id: item.id,
                    skill_name: item.value
                }
            }
        })
    } else if(name === "jobLocation"){
      value = value.map((item) => {
        return {
          location: {
            id: item.id,
            location: item.value
          }
        }
      })
    } else if (name === "jobEmploymentType"){
      value = value.map((item) => {
        return {
          employment_type: {
            id: item.id,
            type: item.value
          }
        }
      })
    } 

    setInputValue((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
     })
  }

  const fieldChecking = async() => {
    const regex = /\S/;
    let status = "success"

    if (!regex.test(inputValue?.jobTitle)){
      setJobTitleAlertField("Job title is required")
      status = "failed"
    }
    if (!regex.test(inputValue?.jobDetail)){
      setJobDetailAlertField("Job detail is required.")
      status = "failed"
    }
    if (inputValue.jobSkills?.length === 0){
      setJobSkillAlertField("Please select minimum 1 skill.")
      status = "failed"
    }
    if (inputValue.jobLocation?.length === 0){
      setJobLocationAlertField("Please select minimum 1 location.")
      status = "failed"
    }
    if (inputValue.jobEmploymentType?.length === 0){
      setJobEmploymentTypeAlertField("Please select minimum 1 employment type.")
      status = "failed"
    }
    if (!regex.test(inputValue?.jobSalary) && inputValue.jobSalaryPaidPeriod?.length === 0){
      setJobSalaryAlertField("Please insert the job salary dan period.")
      status = "failed"
    } else if(!regex.test(inputValue?.jobSalary)){
      setJobSalaryAlertField("Please insert the job salary.")
      status = "failed"
    } else if(inputValue.jobSalaryPaidPeriod?.length === 0){
      setJobSalaryAlertField("Please insert the job salary period.")
      status = "failed"
    }
    if (inputValue.experienceLevel?.length === 0){
      setJobExperienceLevelAlertField("Please select 1 experience level.")
      status = "failed"
    } 
    if (!inputValue.jobDeadline){
      setDeadlineAlertField("Please select deadline.")
      status = "failed"
    }
    
    if (status === "success") {
      return true
    }
  }

  const onSubmitSaveJobForm = async (e) => {
    try{
      e.preventDefault()
      setIsSubmitting(true)
      const checking = await fieldChecking()
      if(checking === true){
        const response = await fetch(`/api/job/update_job/${props.editData.data.id}/`, {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userAuthToken}`
          },
          body: JSON.stringify(inputValue)
        })
        const data = await response.json()
        if (response.ok){
          props.notification(data)
          props.closeForm()
          await props.onLoadJobPosted()
          if (props.needPagination === false){
            if (props.needPagination === false){
              return false
            }
          } else {
            await props.paginationReset()
          }
        }
      }    
      setIsSubmitting(false)
    } catch (error){
      console.error(error);
    } finally{
      document.body.classList.remove("disable-scroll")
    }
    
  }

  const capitalizeFirstLetter = (string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1)
  }

  return (
    <div className='flex justify-center w-screen h-screen items-center'>
      <div className='w-[80%] h-[90%] max-sm:w-[95%] max-sm:h-[80%] bg-white flex flex-wrap items-center justify-center shadow-box-shadow rounded-md'>
        <div id="job-title">
          <p>EDIT JOB</p>
          <br />
          <Divider />
        </div>
        <div id="add-job-form-container" className='w-full h-[80%] px-14 max-sm:px-6'>
          <form id="add-job-form" onSubmit={(e) => onSubmitSaveJobForm(e)}>
            <div className='flex flex-row flex-wrap max-sm:flex-col max-sm:gap-6'>
              <div className='w-[50%] max-sm:w-full'>
                <div>
                  <p className='font-bold'>Status</p>
                  <span>Select this job current status.</span>
                </div>
              </div>
              <div className='w-[50%] max-sm:w-full'>
                <Select
                  id="job-status"
                  name="jobStatus"
                  options={jobStatus.map((item) => ({value: item, label: item}))}
                  value={{value: capitalizeFirstLetter(inputValue?.jobStatus), label: capitalizeFirstLetter(inputValue?.jobStatus)}}
                  onChange={(selectedOption) => onChangeSelectField("jobStatus", selectedOption)}
                  disabled={isSubmitting ? true : false}
                />
                {jobTitleAlertField && <p className='error-field'>{jobTitleAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='flex flex-row flex-wrap max-sm:flex-col max-sm:gap-6'>
              <div className='w-[50%] max-sm:w-full'>
                <div>
                  <p className='font-bold'>Job Title</p>
                  <span>A job title must describe one position only</span>
                </div>
              </div>
              <div className='w-[50%] max-sm:w-full'>
                <input 
                  className='add-job-input-field'
                  value={inputValue?.jobTitle}
                  onChange={(e) => onChangeInputField(e)}
                  name="jobTitle"
                  disabled={isSubmitting ? true : false}
                />
                {jobTitleAlertField && <p className='error-field'>{jobTitleAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='flex flex-row flex-wrap max-sm:flex-col max-sm:gap-6'>
              <div className='w-[50%] max-sm:w-full'>
                <div>
                  <p className='font-bold'>Job Detail</p>
                  <span>Provide a short description about the job. Keep it short and to the point.</span>
                </div>
              </div>
              <div className='w-[50%] max-sm:w-full'>
                <textarea 
                  className='add-job-textarea-field' rows="15" 
                  value={inputValue?.jobDetail}
                  onChange={(e) => onChangeInputField(e)}
                  name='jobDetail'
                  disabled={isSubmitting ? true : false}
                />
                {jobDetailAlertField && <p className='error-field'>{jobDetailAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='flex flex-row flex-wrap max-sm:flex-col max-sm:gap-6'>
              <div className='w-[50%] max-sm:w-full'>
                <div>
                  <p className='font-bold'>Skills</p>
                  <span>Select skills needed for this job.</span>
                </div>
              </div>
              <div className='w-[50%] max-sm:w-full'>
                <Select
                  isMulti
                  id="skill-list"
                  name="jobSkills"
                  options={skillList.map((item) => ({id:item.id, value: item.skill_name, label: item.skill_name}))}
                  value={inputValue.jobSkills?.map((item) => ({ id:item.skill.id, value: item.skill.skill_name, label: item.skill.skill_name }))}
                  onChange={(selectedOption) => onChangeSelectField("jobSkills", selectedOption)}
                  disabled={isSubmitting ? true : false}
                />
                {jobSkillAlertField && <p className='error-field'>{jobSkillAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='flex flex-row flex-wrap max-sm:flex-col max-sm:gap-6'>
              <div className='w-[50%] max-sm:w-full'>
                <div>
                  <p className='font-bold'>Job Location</p>
                  <span>Add location for this job.</span>
                </div>
              </div>
              <div className='w-[50%] max-sm:w-full'>
                <Select
                  isMulti
                  id="company-location"
                  name="jobLocation"
                  options={loadedLocation.map((item) => ({id:item.id, value: item.location, label: item.location}))}
                  value={inputValue.jobLocation?.map((item) => ({id:item.location.id, value: item.location.location, label: item.location.location}))}
                  onChange={(selectedOption) => onChangeSelectField("jobLocation", selectedOption)}
                  disabled={isSubmitting ? true : false}
                />
                {jobLocationAlertField && <p className='error-field'>{jobLocationAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='flex flex-row flex-wrap max-sm:flex-col max-sm:gap-6'>
              <div className='w-[50%] max-sm:w-full'>
                <div>
                  <p className='font-bold'>Employment Type</p>
                  <span>You can pick more than 1 types.</span>
                </div>
              </div>
              <div className='w-[50%] max-sm:w-full'>
                <Select
                  isMulti
                  id="job-employment-type"
                  name="jobEmploymentType"
                  options={employmentTypeList.map((item) => ({id:item.id, value: item.type, label: item.type}))}
                  value={inputValue.jobEmploymentType?.map((item) => ({id:item.employment_type.id, value: item.employment_type.type, label: item.employment_type.type}))}
                  onChange={(selectedOption) => onChangeSelectField("jobEmploymentType", selectedOption)}
                  disabled={isSubmitting ? true : false}
                />
                {jobEmploymentTypeAlertField && <p className='error-field'>{jobEmploymentTypeAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='flex flex-row flex-wrap max-sm:flex-col max-sm:gap-6'>
              <div className='w-[50%] max-sm:w-full'>
                <div>
                  <p className='font-bold'>Salary</p>
                  <span>Choose how you prefer to pay for this job.</span>
                </div>
              </div>
              <div className='flex gap-2 w-[50%] max-sm:w-full'>
                <div className='currency-input-field-container'>
                  <div className='currency-sign-placeholder'>
                    <p>$</p>
                  </div>
                  <input id='add-job-input-field-salary'
                    placeholder='12.3'
                    name='jobSalary'
                    type='number'
                    step="0.01"
                    value={inputValue.jobSalary}
                    onChange={(e) => onChangeInputField(e)}
                    disabled={isSubmitting ? true : false}
                  />
                </div>
                <Select
                  placeholder="Select period..."
                  id='add-job-salary-selection'
                  name="jobSalaryPaidPeriod"
                  options={period.map((item) => ({value: item, label: item}))}
                  value={{value: inputValue.jobSalaryPaidPeriod, label: inputValue.jobSalaryPaidPeriod}}
                  onChange={(selectedOption) => onChangeSelectField("jobSalaryPaidPeriod", selectedOption["value"])}
                  disabled={isSubmitting ? true : false}
                />
              </div>
              {jobSalaryAlertField && <p className='error-field'>{jobSalaryAlertField}</p>}
            </div>
            <Divider />
            <div className='flex flex-row flex-wrap max-sm:flex-col max-sm:gap-6'>
              <div className='w-[50%] max-sm:w-full'>
                <div>
                  <p className='font-bold'>Experience Level</p>
                  <span>How many years is the candidate required to have experience for this job?</span>
                </div>
              </div>
              <div className='w-[50%] max-sm:w-full'>
                <Select
                  id='add-job-experience-level-selection'
                  name="jobExperienceLevel"
                  options={experienceList.map((item) => ({value: item, label: item}))}
                  value={{value: inputValue.jobExperienceLevel, label: inputValue.jobExperienceLevel}}
                  onChange={(selectedOption) => onChangeSelectField("jobExperienceLevel", selectedOption["value"])}
                  disabled={isSubmitting}
                />
                {jobExperienceLevelAlertField && <p className='error-field'>{jobExperienceLevelAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='flex flex-row flex-wrap max-sm:flex-col max-sm:gap-6'>
              <div className='w-[50%] max-sm:w-full'>
                <div>
                  <p className='font-bold'>Deadline</p>
                  <span>The date for this job is no longer available.</span>
                </div>
              </div>
              <div className='w-[50%] max-sm:w-full'>
                <input 
                  type='date' 
                  className='add-job-input-field'
                  id="deadlineInput"
                  name="jobDeadline"
                  onChange={(e) => onChangeInputField(e)} 
                  value={inputValue?.jobDeadline}
                  disabled={isSubmitting ? true : false}
                />
                {deadlineAlertField && <p className='error-field'>{deadlineAlertField}</p>}
              </div>
            </div>
            <br />
            <div id="add-new-job-button">
              <Button buttonType="input" label={isSubmitting ? "Saving..." : "Save"} />
              <Button clickedButton={props.clickedCancel} customClassName="cancel-button" buttonType="input" label="Cancel" />
            </div>
            <br />
          </form>
        </div>
        
      </div>
      {isSubmitting && <Backdrop />}
    </div>
  )
}

export default EditJob