import React, { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Divider } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Button from 'components/Button';

const JobDetail = (props) => {

  const { jobId } = useParams();
  const [jobData, setJobData] = useState([])

  const onLoadJobDetail = async() => {
    const response = await fetch(`/api/job/get_job_detail/${jobId}/`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })

    const data = await response.json()
    if(response.ok){
      console.log(data);
      setJobData(data)
    }
  }

  useEffect(() => {
    onLoadJobDetail()
  }, [])

  const capitalizeFirstLetter = (string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1)
  }

  const test = () => {
    console.log("MASUKKKKKKKKKKKKKKKKKKKKKKK");
  }

  return (
    <div id="job-detail-section">
      <div id='job-detail-container'>
        <div id="job-detail-layout">

          <div id='job-time-status'>
            <p><span id={(() => {
                switch(jobData.status){
                  case "Open":
                    return "job-status-open"
                  case "Closed":
                    return "job-status-closed"
                }
              })()}>{capitalizeFirstLetter(jobData.status)}</span>
            </p>
            <p>Posted On: {jobData.created_at}</p>
          </div>
          <div id='job-detail'>
            <div className='profile_image'>
              <img
              src={jobData.user_profile_picture} // Replace with the actual path or URL of your image
              alt={"profile-picture"}
              className="profile_image"
              />
            </div>
            <div id="job-detail-header">
              <h1>{jobData.job_title}</h1>
              <Link to={`/profile/company/?id=${jobData.user_posted?.id}`}>
                <p id='job-detail-company-name'>{jobData.user_posted?.name}</p>
              </Link>
              <div className='job-detail-icon-info'>
                <LocationOnIcon />
                {jobData.joblocation?.map((item, i) => {
                  return (
                    <p key={i}>{item.location.location} </p>
                  )
                })}
              </div>
              <div className='job-detail-icon-info'>
                <AccessTimeIcon />
                {jobData.jobemploymenttype?.map((item, i) => {
                  return (
                    <p key={i}>{item.employment_type.type}</p>
                  )
                })}
              </div>
              <div className='job-detail-icon-info'>
                <AttachMoneyIcon />
                <p>{jobData.jobsalaryrates?.nominal}</p><span> / </span><p>{jobData.jobsalaryrates?.paid_period}</p>
              </div>
              <div className='job-detail-icon-info'>
                <PsychologyIcon />
                <p>{jobData.experience_level}</p>
              </div>
              
              <div id="job-skills">
                  <ul>
                  {jobData.jobskills?.map((item, i) => {
                    return (
                      <li key={i}>{item.skill.skill_name}</li>
                    )
                  })}
                  </ul>
              </div>
            </div>
          </div>
          <div id="job-detail-action-button">
              
              <Button 
                buttonType="button" 
                label="Interested"
                clickedButton={() => test()} 
                customClassName={jobData.status === "closed" ? "disabled-button" : "input-button"}
                isDisabled={jobData.status === "closed" ? true : false}
              />
          </div>
          <br />
          <div id='job-detail-description'>
            <br />
            <Divider />
            <h1>Job Description</h1>
            <br />
            {jobData.job_detail?.split("\n").map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
            ))}
            <br />
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail