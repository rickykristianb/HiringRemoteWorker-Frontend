import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { Divider } from '@mui/material';
import { format } from 'date-fns';
import AuthContext from 'Context/AuthContext';
import NotLoginAction from 'components/NotLoginAction';
import AlertNotification from 'components/AlertNotification';
import JobDetailSkeleton from 'components/Skeleton/JobDetailSkeleton';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

const JobDetail = (props) => {
  const navigate = useNavigate()
  const { user, authToken} = useContext(AuthContext)
  const location = useLocation();

  let userToken = null
  if (authToken){
    userToken = authToken.access
  }

  const userType = localStorage.getItem("userType")

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
  }, [location.search])

  const { jobId } = useParams();
  const [jobData, setJobData] = useState([])
  const [isNotLogin, setIsNotLogin] = useState(false)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
  const [jobInterestedStatus, setJobInterestedStatus] = useState()
  const [isSendingInterest, setIsSendingInterest] = useState(false)
  const [alertResponse, setAlertResponse] = useState()
  const [loginUserId, setLoginUserId] = useState()
  const [getJobDetailLoading, setGetJobDetailLoading] = useState(false)
  const [jobIsSaved, setJobIsSaved] = useState(false)

  useEffect(() => {
    setLoginUserId(localStorage.getItem("userId"))
  }, [])

  const onLoadJobDetail = async() => {
    setGetJobDetailLoading(true)
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
        setJobData(data)
      }
    }
    setGetJobDetailLoading(false)
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

  const onCheckSavedJobs = async() => {
    const response = await fetch(`/api/job/check_saved_job/${jobId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": `JWT ${userToken}`
      }
    });
    const data = await response.json()
    if (response.status === 302){
      setJobIsSaved(true)
    } else if (response.status === 404){
      setJobIsSaved(false)
    }
  }

  useEffect(() => {
    onLoadJobDetail()
    onCheckAppliedJobs()
    onCheckSavedJobs()
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
    if (user){
      if (userType === "personal"){
        onProcessInterestedClick(jobId)
      }
    } else {
      onOpenIsNotLogin()
    }
  }

  const saveJob = async(id) => {
    try{
        const response = await fetch(`/api/job/save_job/`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            },
            body: JSON.stringify(
                {
                    "id": id
                }
                )
        });
        const data = await response.json()
        if (response.ok){
            setJobIsSaved(true)
            setAlertResponse({"success": data["success"]})
        } else {
          console.log(data);
            // setAlertResponse({"error": data["error"]})
        }
    } catch (error){
        setAlertResponse({"error": error})
    }
  }

  const deleteSavedJob = async(id) => {
    const response = await fetch(`/api/job/delete_saved_job/${id}/`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "Authorization": `JWT ${userToken}`
      }
    });
    const data = await response.json()
    if (response.ok){
      setJobIsSaved(false)
      setAlertResponse({"success": data["success"]})
    }
  }

  return (
    <>
    {getJobDetailLoading ?
      <JobDetailSkeleton />
      :
      <>
      {/* FOR LARGE SCREEN */}
        <div className="flex justify-center max-sm:hidden">
          <div className='bg-white flex flex-wrap flex-col my-16 xl:w-[70%] max-lg:w-[90%] rounded-lg shadow-box-shadow p-2'>
          {jobData ? 
            <div className='flex flex-col'>
              <div className='flex justify-end gap-10 mx-10'>
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
              <div className='flex p-12'>
                <div className='profile_image max-lg:w-48 max-lg:h-48'>
                  <img
                  src={jobData.user_profile_picture} // Replace with the actual path or URL of your image
                  alt={"profile-picture"}
                  className="profile_image max-lg:w-48 max-lg:h-48"
                  />
                </div>
                <div className='px-10'>
                  <p className='text-3xl font-bold'>{jobData.job_title}</p>
                  <Link to={`/profile/company/?id=${jobData.user_posted?.id}`}>
                    <p className='hover:underline my-6'>{jobData.user_posted?.name}</p>
                  </Link>
                  <div className='flex items-center gap-2 my-6'>
                    <LocationOnIcon />
                    <ul className='flex flex-wrap gap-2'>
                      {jobData.joblocation?.map((item, i) => {
                        return (
                          <li key={i}>{item.location.location} </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className='flex items-center gap-2 my-6'>
                    <AccessTimeIcon />
                    {jobData.jobemploymenttype?.map((item, i) => {
                      return (
                        <p key={i}>{item.employment_type.type}</p>
                      )
                    })}
                  </div>
                  <div className='flex items-center gap-2 my-6'>
                    <AttachMoneyIcon />
                    <p>{jobData.jobsalaryrates?.nominal}</p><span> / </span><p>{jobData.jobsalaryrates?.paid_period}</p>
                  </div>
                  <div className='flex items-center gap-2 my-6'>
                    <PsychologyIcon />
                    <p>{jobData.experience_level}</p>
                  </div>
                  <div className='flex items-center gap-2 my-6'>
                    <span>Apply before:</span>
                    <p>{jobData?.deadline && format(new Date(jobData?.deadline), 'MM-dd-yyyy')}</p>
                  </div>
                  
                  <div className='w-full'>
                      <ul className='pl-0 flex flex-wrap gap-[10px]'>
                      {jobData.jobskills?.map((item, i) => {
                        return (
                          <li key={i} className='bg-gray-200 border border-skills-list rounded-md p-1'>{item.skill.skill_name}</li>
                        )
                      })}
                      </ul>
                  </div>
                </div>
              </div>
              <div className='mx-5'>
                  {
                  isAlreadyApplied ?
                    <div className='flex justify-center'>
                      <div className='flex items-center h-12 px-10 bg-soft-basic rounded-lg shadow-box-shadow'>
                        <p>{onGenerateStatusHighlight(jobInterestedStatus)}</p>
                      </div>
                    </div>
                  :
                  (loginUserId !== jobData.user_posted?.id) && 
                    (jobData.status !== "Finished" && jobData.status !== "Onprogress" && jobData.status !== "Closed" && userType !== "company") &&
                      <div className='flex h-12 w-64 ml-5'>
                        <div className='w-[80%] flex justify-center items-center border-1.5 border-dark-basic rounded-l-lg cursor-pointer text-xl text-white bg-dark-basic hover:bg-white hover:text-dark-basic transition-all duration-200'
                          onClick={() => onInterestedClicked(jobData.id)}
                        >
                          <p>{isSendingInterest ? "Sending..." : "Interested"}</p>
                        </div>
                        <div className='flex justify-center items-center w-[20%] border-dark-basic border-1.5 border-l-0 rounded-r-lg cursor-pointer'>
                        {jobIsSaved ?
                          <BookmarkAddedIcon sx={{width: "35px", height: "35px"}} className='text-bookmark-saved-button hover:w-[40px] hover:h-[40px]' onClick={() => deleteSavedJob(jobData.id)} />
                          :
                          <BookmarkAddIcon sx={{width: "35px", height: "35px"}} className='hover:w-[40px] hover:h-[40px]' onClick={() => saveJob(jobData.id)} />
                        }
                        </div>
                      </div>
                  }   
              </div>
              <br />
              <div className='mx-10'>
                <br />
                <Divider />
                <p className='text-3xl mt-5 font-bold'>Job Description</p>
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

        {/* FOR MOBILE */}
        <div className="max-sm:blocked sm:hidden mt-24">
          {jobData ? 
            <div className='flex flex-col'>
              <div className='flex justify-between pl-10 pr-5'>
                <p>Posted On: {jobData.created_at}</p>
                <p className='self-end'><span id={(() => {
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
                
              </div>
              <div className='flex flex-col'>
                <br />
                <div className='px-10'>
                  <p className='text-3xl font-bold'>{jobData.job_title}</p>
                  <Link to={`/profile/company/?id=${jobData.user_posted?.id}`}>
                    <p className='hover:underline my-6'>{jobData.user_posted?.name}</p>
                  </Link>
                  <div className='flex items-start gap-2 my-6'>
                    <LocationOnIcon />
                    <ul className='flex flex-wrap gap-2'>
                      {jobData.joblocation?.map((item, i) => {
                        return (
                          <li key={i}>{item.location.location} </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className='flex items-center gap-2 my-6'>
                    <AccessTimeIcon />
                    {jobData.jobemploymenttype?.map((item, i) => {
                      return (
                        <p key={i}>{item.employment_type.type}</p>
                      )
                    })}
                  </div>
                  <div className='flex items-center gap-2 my-6'>
                    <AttachMoneyIcon />
                    <p>{jobData.jobsalaryrates?.nominal}</p><span> / </span><p>{jobData.jobsalaryrates?.paid_period}</p>
                  </div>
                  <div className='flex items-center gap-2 my-6'>
                    <PsychologyIcon />
                    <p>{jobData.experience_level}</p>
                  </div>
                  <div className='flex items-center gap-2 my-6'>
                    <span>Apply before:</span>
                    <p>{jobData?.deadline && format(new Date(jobData?.deadline), 'MM-dd-yyyy')}</p>
                  </div>
                  
                  <div className='w-full'>
                      <ul className='pl-0 flex flex-wrap gap-[10px]'>
                      {jobData.jobskills?.map((item, i) => {
                        return (
                          <li key={i} className='bg-gray-200 border border-skills-list rounded-md p-1'>{item.skill.skill_name}</li>
                        )
                      })}
                      </ul>
                  </div>
                </div>
              </div>
              <div className='mx-5'>
                  {
                  isAlreadyApplied ?
                    <div className='flex justify-center mt-10 px-5'>
                      <div className='flex text-center items-center h-12 px-2 bg-soft-basic rounded-lg shadow-box-shadow'>
                        <p>{onGenerateStatusHighlight(jobInterestedStatus)}</p>
                      </div>
                    </div>
                  :
                  (loginUserId !== jobData.user_posted?.id) && 
                    (jobData.status !== "Finished" && jobData.status !== "Onprogress" && jobData.status !== "Closed" && userType !== "company") &&
                      <div className='sticky top-10'>
                        <br />
                        <div className='flex h-10 w-full'>
                          <div className='w-[20%] flex justify-center items-center border-1.5 border-r-0 rounded-l-lg border-dark-basic cursor-pointer'>
                            {jobIsSaved ?
                              <BookmarkAddedIcon onClick={() => deleteSavedJob(jobData.id)} sx={{width: "40px", height: "40px", color: "red"}} />
                            :
                              <BookmarkAddIcon onClick={() => saveJob(jobData.id)} />
                            }
                          </div>
                          <div className='w-[80%] flex justify-center items-center border-1.5 border-dark-basic rounded-r-lg cursor-pointer text-xl text-white bg-dark-basic hover:bg-white hover:text-dark-basic transition-all duration-200'
                            onClick={() => onInterestedClicked(jobData.id)}
                          >
                          <p>{isSendingInterest ? "Sending..." : "Interested"}</p>
                        </div>
                      </div>
                      </div>
                      
                  }   
              </div>
              <div className='mx-10 mt-0'>
                <br />
                <Divider />
                <p className='text-3xl mt-5 font-bold'>Job Description</p>
                <br />
                {jobData.job_detail?.split("\n").map((line, i) => (
                    <Fragment key={i} >
                      {i > 0 && <br />}
                      <p className="text-sm">{line}</p>
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
      </>
    }
    </>
  )
}

export default JobDetail