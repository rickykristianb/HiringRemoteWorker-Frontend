import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Divider } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Button from 'components/Button';
import { format } from 'date-fns';
import AuthContext from 'Context/AuthContext';
import NotLoginAction from 'components/NotLoginAction';
import AlertNotification from 'components/AlertNotification';

const JobDetail = (props) => {
  const { user, authToken } = useContext(AuthContext)
  const [clickedUserId, setClickedUserId] = useState()
  const location = useLocation();

  let userToken = null
  if (authToken){
    userToken = authToken.access
  }

  const navigate = useNavigate()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    setClickedUserId(id)
  }, [location.search])

  const { jobId } = useParams();
  const [jobData, setJobData] = useState([])
  const [isNotLogin, setIsNotLogin] = useState(false)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
  const [jobInterestedStatus, setJobInterestedStatus] = useState()
  const [isSendingInterest, setIsSendingInterest] = useState(false)
  const [alertResponse, setAlertResponse] = useState()
  const [loginUserId, setLoginUserId] = useState()

  useEffect(() => {
    setLoginUserId(localStorage.getItem("userId"))
  }, [])

  const onLoadJobDetail = async() => {
    const response = await fetch(`/api/job/get_job_detail/${jobId}/`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })

    const data = await response.json()
    if (data.error){
      navigate("/job-not-found/")
    } else {
      if(response.ok){
        console.log(data);
        setJobData(data)
      }
    }
    
  }

  const onCheckAppliedJobs = async() => {
    try{
      if (userToken){
        const response = await fetch(`/api/job/check_user_already_applied/${jobId}/`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "Authorization": `JWT ${userToken}`
          }
        });
        const data = await response.json()
        if (response.ok){
          setIsAlreadyApplied(data["is_exist"])
          setJobInterestedStatus(data["status"])
        }
      } else {
        setIsAlreadyApplied(false)
      }
      
    } catch (error){
      console.error({"Encounter an error": error});
    }
  }

  useEffect(() => {
    onLoadJobDetail()
    onCheckAppliedJobs()
  }, [])

  const onGenerateStatusHighlight = (status) => {
    let statusCovert = ""
        switch (status){
            case "Eliminated":
                return statusCovert = "I am sorry, you are rejected.";
                break;
            case "Applied":
                return statusCovert = "You have send your interest to this job. Wait for the next good news.";
                break;
            case "Reviewed":
                return statusCovert = "Yours is being reviewed.";
                break;
            case "Whitelist":
                return statusCovert = "Hold on, you are on the queue.";
                break;
            case "Accepted":
                return statusCovert = "You got it, you have been accepted to work with us.";
                break;
            case "Withdraw":
                return statusCovert = "You have withdrawn from this job. You cannot reapply.";
                break;
        }
  }

  const onProcessInterestedClick = async (jobId) => {
    console.log("ID: ", jobId);
    try{
        setIsSendingInterest(true)
        const response = await fetch(`/api/job/interest_job/${jobId}/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json()
        if (response.ok){
            setAlertResponse({"success": data["success"]})
        } else {
            setAlertResponse({"error": data["error"]})
        }
    }catch (error){
        console.error("Encounter an error: ", error);
    } finally {
        setIsSendingInterest(false)
        await onCheckAppliedJobs()
    }
}

  const capitalizeFirstLetter = (string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1)
  }

  const onOpenIsNotLogin = () => {
    document.body.classList.add('disable-scroll');
    setIsNotLogin(true)
  }

  const onCloseIsNotLogin = () => {
      document.body.classList.remove('disable-scroll');
      setIsNotLogin(false)
  }

  const onInterestedClicked = (jobId) => {
    {user ? onProcessInterestedClick(jobId) : onOpenIsNotLogin()}
  }

  return (
    <div id="job-detail-section">
      <div id='job-detail-container'>
      {jobData ? 
        <div id="job-detail-layout">
          <div id='job-time-status'>
            <p><span id={(() => {
                switch(jobData.status){
                  case "Open":
                    return "job-status-open"
                  case "Closed":
                    return "job-status-closed"
                  case "Onprogress":
                    return "job-status-onprogress"
                  case "Finished":
                    return "job-status-finished"
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
              <div className='job-detail-icon-info'>
                <span>Apply before:</span>
                <p>{jobData?.deadline && format(new Date(jobData?.deadline), 'MM-dd-yyyy')}</p>
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
              {
              isAlreadyApplied ?
                <div id='job-already-applied-status-container'>
                  <div id='job-already-applied-status-layout'>
                    <p>{onGenerateStatusHighlight(jobInterestedStatus)}</p>
                  </div>
                </div>
              :
              (loginUserId !== jobData.user_posted?.id) && 
                (jobData.status !== "Finished" && jobData.status !== "Onprogress" && jobData.status !== "Closed") &&
                  <Button 
                    buttonType="button" 
                    label={isSendingInterest ? "Sending..." : "Interested"}
                    clickedButton={() => onInterestedClicked(jobData.id)} 
                    customClassName={jobData.status === "closed" ? "disabled-button" : "input-button"}
                    isDisabled={jobData.status === "closed" ? true : false}
                  />
              }   
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
      :
      <p>No job at the moment.</p>
      }
      </div>
      {isNotLogin && 
        <NotLoginAction 
          boxTitle="Interested? Please use Work Match account."
          boxTagline="Build your profile, apply to this job with a free Work Match account."
          close={onCloseIsNotLogin} 
        />
      }
      {<AlertNotification alertData={alertResponse} />}
    </div>
  )
}

export default JobDetail