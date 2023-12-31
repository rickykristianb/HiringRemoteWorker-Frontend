import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Divider } from '@mui/material'
import Select from "react-select";
import Button from './Button';
import AuthContext from 'Context/AuthContext';
import Backdrop from 'components/Backdrop';

const AddJob = (props) => {

  const navigate = useNavigate()

  let userAuthToken
  let { authToken } = useContext(AuthContext)
  if (authToken){
    userAuthToken = authToken.access
  } 

  const period = ["Year", "Month", "Hour"]
  const experienceList = [
    "1 - 2 years", "2 - 4 years", "4 - 6 years", "6 - 8 years", "8 - 10 years", " > 10 years"
  ]
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
  const [inputValue, setInputValue] = useState({
    jobTitle: "",
    jobDetail: "",
    jobSkills: [],
    jobLocation: [],
    jobEmploymentType: [],
    jobSalary: "",
    jobSalaryPaidPeriod: "",
    experienceLevel: ""
  });

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
        console.log(dataList);
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
    console.log("DATA", data);
}

  useEffect(() => {
    onLoadLocation()
    onLoadListEmploymentType()
    onLoadSkills()
  }, [])

  const onCheckChangeInput = (name) => {
    console.log("NAME", name);
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
    console.log(inputValue);
  }

  const onChangeSelectField = (name, value) => {
    onCheckChangeInput(name)
    setInputValue((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
     })
    console.log(inputValue);
  }

  const fieldChecking = async() => {

    const regex = /\S/;
    let status = "success"

    if (!regex.test(inputValue.jobTitle)){
      setJobTitleAlertField("Job title is required")
      status = "failed"
    }
    if (!regex.test(inputValue.jobDetail)){
      setJobDetailAlertField("Job detail is required.")
      status = "failed"
    }
    if (inputValue.jobSkills.length === 0){
      setJobSkillAlertField("Please select minimum 1 skill.")
      status = "failed"
    }
    if (inputValue.jobLocation.length === 0){
      setJobLocationAlertField("Please select minimum 1 location.")
      status = "failed"
    }
    if (inputValue.jobEmploymentType.length === 0){
      setJobEmploymentTypeAlertField("Please select minimum 1 employment type.")
    }
    if (!regex.test(inputValue.jobSalary) && inputValue.jobSalaryPaidPeriod.length === 0){
      setJobSalaryAlertField("Please insert the job salary dan period.")
      status = "failed"
    } else if(!regex.test(inputValue.jobSalary)){
      setJobSalaryAlertField("Please insert the job salary.")
      status = "failed"
    } else if(inputValue.jobSalaryPaidPeriod.length === 0){
      setJobSalaryAlertField("Please insert the job salary period.")
      status = "failed"
    }
    if (inputValue.experienceLevel.length === 0){
      setJobExperienceLevelAlertField("Please select 1 experience level.")
      status = "failed"
    } 
    
    if (status === "success") {
      return true
    }
  }

  const onSubmitAddJobForm = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const checking = await fieldChecking()
    if(checking === true){
      console.log("MASKKK DONG");
      const response = await fetch("/api/job/add-job/", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Authorization": `JWT ${userAuthToken}`
        },
        body: JSON.stringify(inputValue)
      })
      const data = await response.json()
      if (response.ok){
        if(props.type === "job-posted-form" ){
          props.notification(data)
          props.closeForm()
          await props.onLoadJobPosted()
          
        } else {
          navigate("/jobs/")
          // const timeoutId = setTimeout(() => {
          //   navigate("/jobs/")
          // }, 20000)
          // return () => clearTimeout(timeoutId);
        }
      }
    }    
    setIsSubmitting(false)
  }

  return (
    <div id="add-job-section">
      <div id={props.type === "job-posted-form" ? props.type : "add-job-container"}>
        <div id="job-title">
          <p>ADD JOB</p>
          <br />
          <Divider />
        </div>
        <div id="add-job-form-container">
          <form id="add-job-form" onSubmit={(e) => onSubmitAddJobForm(e)}>

            <div className='input-title-container'>
              <div className='add-job-form-title'>
                <div>
                  <p>Job Title</p>
                  <span>A job title must describe one position only</span>
                </div>
              </div>
              <div className='add-job-input-field-container'>
                <input 
                  className='add-job-input-field'
                  onChange={(e) => onChangeInputField(e)}
                  name="jobTitle"
                  disabled={isSubmitting ? true : false}
                />
                {jobTitleAlertField && <p className='error-field'>{jobTitleAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='input-title-container'>
              <div className='add-job-form-title'>
                <div>
                  <p>Job Detail</p>
                  <span>Provide a short description about the job. Keep it short and to the point.</span>
                </div>
              </div>
              <div className='add-job-input-field-container'>
                <textarea 
                  className='add-job-textarea-field' rows="15" 
                  onChange={(e) => onChangeInputField(e)}
                  name='jobDetail'
                  disabled={isSubmitting ? true : false}
                />
                {jobDetailAlertField && <p className='error-field'>{jobDetailAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='input-title-container'>
              <div className='add-job-form-title'>
                <div>
                  <p>Skills</p>
                  <span>Select skills needed for this job.</span>
                </div>
              </div>
              <div className='add-job-input-field-container'>
                <Select
                  isMulti
                  id="skill-list"
                  name="jobSkills"
                  options={skillList.map((item) => ({id:item.id, value: item.skill_name, label: item.skill_name}))}
                  onChange={(selectedOption) => onChangeSelectField("jobSkills", selectedOption)}
                  disabled={isSubmitting ? true : false}
                />
                {jobSkillAlertField && <p className='error-field'>{jobSkillAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='input-title-container'>
              <div className='add-job-form-title'>
                <div>
                  <p>Job Location</p>
                  <span>Add location for this job.</span>
                </div>
              </div>
              <div className='add-job-input-field-container'>
                <Select
                  isMulti
                  id="company-location"
                  name="jobLocation"
                  options={loadedLocation.map((item) => ({id:item.id, value: item.location, label: item.location}))}
                  onChange={(selectedOption) => onChangeSelectField("jobLocation", selectedOption)}
                  disabled={isSubmitting ? true : false}
                />
                {jobLocationAlertField && <p className='error-field'>{jobLocationAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='input-title-container'>
              <div className='add-job-form-title'>
                <div>
                  <p>Employment Type</p>
                  <span>You can pick more than 1 types.</span>
                </div>
              </div>
              <div className='add-job-input-field-container'>
                <Select
                  isMulti
                  id="job-employment-type"
                  name="jobEmploymentType"
                  options={employmentTypeList.map((item) => ({id:item.id, value: item.type, label: item.type}))}
                  onChange={(selectedOption) => onChangeSelectField("jobEmploymentType", selectedOption)}
                  disabled={isSubmitting ? true : false}
                />
                {jobEmploymentTypeAlertField && <p className='error-field'>{jobEmploymentTypeAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='input-title-container'>
              <div className='add-job-form-title'>
                <div>
                  <p>Salary</p>
                  <span>Choose how you prefer to pay for this job.</span>
                </div>
              </div>
              <div id='add-job-input-salary-field-container'>
                <div id='job-salary-currency'>
                  <div className='currency-input-field-container'>
                    <div className='currency-sign-placeholder'>
                      <p>$</p>
                    </div>
                    <input id='add-job-input-field-salary'
                      placeholder='12.3'
                      name='jobSalary'
                      type='number'
                      step="0.01"
                      onChange={(e) => onChangeInputField(e)}
                      disabled={isSubmitting ? true : false}
                    />
                  </div>
                  <Select
                    placeholder="Select period..."
                    id='add-job-salary-selection'
                    name="jobSalaryPaidPeriod"
                    options={period.map((item) => ({value: item, label: item}))}
                    onChange={(selectedOption) => onChangeSelectField("jobSalaryPaidPeriod", selectedOption["value"])}
                    disabled={isSubmitting ? true : false}
                  />
                </div>
                {jobSalaryAlertField && <p className='error-field'>{jobSalaryAlertField}</p>}
              </div>
            </div>
            <Divider />
            <div className='input-title-container'>
              <div className='add-job-form-title'>
                <div>
                  <p>Experience Level</p>
                  <span>How many years is the candidate required to have experience for this job?</span>
                </div>
              </div>
              <div className='add-job-input-field-container'>
                <Select
                  id='add-job-experience-level-selection'
                  name="experienceLevel"
                  options={experienceList.map((item) => ({value: item, label: item}))}
                  onChange={(selectedOption) => onChangeSelectField("experienceLevel", selectedOption["value"])}
                  disabled={isSubmitting}
                />
                {jobExperienceLevelAlertField && <p className='error-field'>{jobExperienceLevelAlertField}</p>}
              </div>
            </div>
            <br />
            <div id="add-new-job-button">
              <Button buttonType="input" label={isSubmitting ? "Saving..." : "Add"} />
              {props.type === "job-posted-form" 
                && 
                <Button clickedButton={props.clickedCancel} customClassName="company-profile-cancel-button" buttonType="input" label="Cancel" />
              }
            </div>
            <br />
          </form>
        </div>
        
      </div>
      {isSubmitting && <Backdrop />}
    </div>
  )
}

export default AddJob