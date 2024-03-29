import { Divider } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import Button from 'components/Button'
import React, { useContext, useEffect, useRef, useState } from 'react'
import AddJob from 'components/AddJob';
import EditJob from 'components/EditJob';
import AlertNotification from 'components/AlertNotification';
import Pagination from 'components/Pagination';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from 'Context/AuthContext';
import NotLoginAction from 'components/NotLoginAction';
import Loading from 'components/Loading';

const JobPosted = (props) => {

  const [alertResponse, setAlertResponse] = useState()
  const [loginUserId, setLoginUserId] = useState()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [jobPostedData, setJobPostedData] = useState([])
  const [totalJobPosted, setTotalJobPosted] = useState()
  const [isMouseEnter, setIsMouseEnter] = useState()
  const [isEditJob, setIsEditJob] = useState(false)
  const [editJobData, setEditJobData] = useState()
  const [isNotLogin, setIsNotLogin] = useState(false)
  const [isPaginationReset, setIsPaginationReset] = useState(false)
  const [isSendingInterest, setIsSendingInterest] = useState(false)
  const [loading, setLoading] = useState(false)
  const pageNumber = useRef(1)

  const { user, authToken } = useContext(AuthContext)
  let userToken = null
  if (authToken){
    userToken = authToken.access
  }
  
  useEffect(() => {
    setLoginUserId(localStorage.getItem("userId"))
  }, [])

  const location = useLocation();
  useEffect(() => {
    const onFirstLoadJobPosted = async() => {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get('id');
      const response = await fetch(`/api/job/all_user_jobs/${id}/?page=1`,{
        method: "GET",
        headers: {
          "content-type": "application/json"
        }
      })
      const data = await response.json()
      if (response.ok){
        setJobPostedData(data["data"])
        setTotalJobPosted(data["total_data"])
      }
    }
    onFirstLoadJobPosted()
  }, [])

  const onLoadJobPosted = async(page) => {
    setLoading(!loading)
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    if (!page){
      page = pageNumber.current
    } else {
      page = page["page"]
    }
    const response = await fetch(`/api/job/all_user_jobs/${id}/?page=${page}`,{
      method: "GET",
      headers: {
        "content-type": "application/json"
      }
    })
    const data = await response.json()
    if (response.ok){
      setJobPostedData(data["data"])
      setTotalJobPosted(data["total_data"])
    }
    setLoading(false)
  }

  const onClickAddButton = () => {
    setIsFormOpen(true)

    document.body.classList.add('disable-scroll');
  }

  const onClickCancelButtonAddForm = () => {
    setIsFormOpen(false)

    document.body.classList.remove('disable-scroll');
  }

  const test = (id) => {
    console.log(id);
  }

  const onClickEditJobButton = (data) => {
    setIsEditJob(true)
    setEditJobData(data)
    document.body.classList.add('disable-scroll');
  }

  const onMouseEnterJob = (id) => {
    setIsMouseEnter(id)
  }

  const onMouseLeaveJob = () => {
    setIsMouseEnter("")
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const onClickCancelButton = () => {
    setIsEditJob(false)

    document.body.classList.remove('disable-scroll');
  }

  const resetPage = () => {
    // RESET PAGINATION NUMBER TO 1
    setIsPaginationReset(true)
    setTimeout(() => {
        setIsPaginationReset(false)
    }, 1)
  }

  const onOpenIsNotLogin = () => {
    document.body.classList.add('disable-scroll');
    setIsNotLogin(true)
  }

  const onCloseIsNotLogin = () => {
      document.body.classList.remove('disable-scroll');
      setIsNotLogin(false)
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
    }
  }

  const onInterestedClicked = (jobId) => {
    {user ? onProcessInterestedClick(jobId) : onOpenIsNotLogin()}
  }

  return (
    <div id='job-posted-container'>
        <Divider />
        <div className='flex justify-between'>
            <p className='text-3xl font-bold leading-[80px]'>Job Posted</p>
            {loginUserId === props.clickedUserId && 
              <div id='add-job-button'>
                {loginUserId === props.clickedUserId &&
                  <span ><Button buttonType="button" label="Add" clickedButton={() => onClickAddButton()}/></span>
                }
                {isFormOpen 
                && 
                <div id='posted-page-add-job-form-container'>
                  <AddJob 
                    type="job-posted-form" 
                    clickedCancel={onClickCancelButtonAddForm} 
                    closeForm={onClickCancelButtonAddForm} 
                    notification={setAlertResponse}
                    onLoadJobPosted={onLoadJobPosted}
                  />
                </div>
                }
              </div>
            }
        </div>
        <br />
        <br />
        <div id="job-posted-list-container">
        {jobPostedData.length > 0 ? 
          jobPostedData.map((item) => {
            return (
              <div key={item.id} className='flex border p-4 w-full max-sm:flex-col' onMouseEnter={() => onMouseEnterJob(item.id)} onMouseLeave={() => onMouseLeaveJob()}>
                <div className='w-[470px] max-sm:w-full'>
                  <Link to={`/jobs/${item.id}/?id=${props.clickedUserId}`}>
                    <p className='text-3xl font-bold mb-6'>{item.job_title}</p>
                  </Link>
                  <p className='mb-2'>{item.user_posted?.name}</p>
                  <div>
                    {item.joblocation.slice(0, 3).map((location) => {
                      return(
                        <span>{location.location.location}</span>
                      )
                    })}
                    {item.joblocation.length > 3 && 
                      <Link to={`/jobs/${item.id}/`}>
                        <span>| see more...</span>
                      </Link>
                    }
                  </div>
                </div>
                <div className='w-[380px] max-sm:w-full'>
                  <ul className='flex flex-row flex-wrap gap-2 mt-4'>
                  {item.jobskills.slice(0, 6).map((item) => {
                    return (
                      <li className='p-[5px] border-1.5 rounded-sm bg-skills-list'>{item.skill.skill_name}</li>
                    )
                  })}
                  </ul>
                </div>
                <div className='flex flex-col gap-4 justify-center items-end max-sm:flex-row max-sm:justify-start max-sm:mt-4'>
                  {isMouseEnter === item.id
                  ?
                  <div className='pl-3 max-sm:pl-0'>
                    {loginUserId !== props.clickedUserId ?
                      item.status !== "Finished" ? 
                        <Button buttonType="button" label={isSendingInterest ? "Sending..." : "Interested"} clickedButton={() => onInterestedClicked(item.id)} />
                      :
                      setIsMouseEnter("")
                    :
                      <div className='pl-8 max-sm:pl-0'>
                        <Button buttonType="button" label="Edit" 
                          clickedButton={() => onClickEditJobButton({
                            data: {
                              id: item.id, 
                              jobTitle: item.job_title,
                              jobDetail: item.job_detail,
                              skills: item.jobskills,
                              jobLocation: item.joblocation,
                              jobEmploymentType: item.jobemploymenttype,
                              jobSalary: item.jobsalaryrates,
                              jobExperienceLevel: item.experience_level,
                              jobStatus: item.status,
                              jobDeadline: item.deadline
                            }
                          })} />
                        </div>
                      
                    }
                  </div>
                  :
                  <div className='flex flex-col gap-4 items-end pl-6 max-sm:flex-row max-sm:pl-0'>
                    <p>{item.created_at}</p>
                    <div id="loved-counter">
                      <FavoriteIcon />
                      <span>{item.interesteduser.length}</span>
                    </div>
                    <p><span id={(() => {
                      switch(item.status){
                        case "Open":
                          return "job-status-open"
                        case "Closed":
                          return "job-status-closed"
                        case "Finished":
                          return "job-status-finished"
                      }
                    })()}>{capitalizeFirstLetter(item.status)}</span></p>
                  </div>
                  }
                </div>
              </div>
            )
          })
        :
          <p>No job at the moment</p>
        }
        </div>
        <br />
        {jobPostedData.length > 0 &&
          <div>
            <Pagination 
              type="jobPosted" 
              totalData={totalJobPosted} 
              onLoadJobPostedPaginate={onLoadJobPosted}
              paginationReset={isPaginationReset}
            />
          </div>
        }

        {isEditJob && 
          <div id='posted-page-edit-job-form-container'>
            <EditJob 
              editData={editJobData} 
              clickedCancel={() => onClickCancelButton()}
              closeForm={() => onClickCancelButton()} 
              notification={setAlertResponse}
              onLoadJobPosted={onLoadJobPosted}
              paginationReset={resetPage} 
            />
          </div>
        }
        {isNotLogin &&
          <NotLoginAction close={onCloseIsNotLogin} 
            boxTitle="Interested? Please use Work Match account."
            boxTagline="Build your profile, apply to this job with a free Work Match account."
          />
        }
        {alertResponse && <AlertNotification alertData={alertResponse} />}
        {loading &&
          <div className='fixed top-0 left-0 w-full h-full '>
            <Loading />
          </div>
        }
    </div>
  )
}

export default JobPosted