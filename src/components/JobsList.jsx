import React, { useContext, useEffect, useRef, useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from './Button';
import Backdrop from './Backdrop';
import Pagination from './Pagination';
import AuthContext from 'Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import NotLoginAction from './NotLoginAction';
import AlertNotification from './AlertNotification';
import UserJobSkeleton from './Skeleton/UserJobSkeleton';

const JobsList = (props) => {

    const navigate = useNavigate()

    const { user, authToken } = useContext(AuthContext)

    let userToken = null
    if (authToken){
      userToken = authToken.access
    }

    const [isHover, setIsHover] = useState(false)
    const [allJobsData, setAllJobsData] = useState([])
    const [backdropActive, setBackdropActive] = useState(false)
    const [noJobStatus, setNoJobStatus] = useState()
    const [resetPage, setResetPage] = useState(false)
    const [isNotLogin, setIsNotLogin] = useState(false)
    const [isSendingInterest, setIsSendingInterest] = useState(false)
    const [alertResponse, setAlertResponse] = useState()
    const [skeletonActive, setSkeletonActive] = useState(false)
    let totalJobPosted = useRef(1)

    const onLoadAllJobs = async(page) => {
       try{
        setBackdropActive(true)
        if (!page){
            page = 1
        } else{
            page = page["page"]
        }
        const response = await fetch(`/api/job/get_all_job/?page=${page}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        })
        const data = await response.json()
        if (response.ok){
            setAllJobsData(data["data"])
            totalJobPosted.current = data["total_user"]
            setBackdropActive(false)
        }
       } catch (error){
        console.error("Encounter an error: ", error);
       } finally {
        setBackdropActive(false)
       }
    }

    useEffect(() => {
        const fetchData = async() => {
            setSkeletonActive(true)
            await onLoadAllJobs()
            setSkeletonActive(false)
        }
        fetchData()
    }, [])

    const onMouseHover = (index) => {
        setIsHover(index)
      }
    
    const onMouseLeaveHover = () => {
        setIsHover(false)
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
        }
    }

    const onClickInterest = (jobId) => {
        {user ? onProcessInterestedClick(jobId) : onOpenIsNotLogin()}
    }

    const onOpenIsNotLogin = () => {
        document.body.classList.add('disable-scroll');
        setIsNotLogin(true)
    }

    const onCloseIsNotLogin = () => {
        document.body.classList.remove('disable-scroll');
        setIsNotLogin(false)
    }

    const onDetailClicked = (id) => {
        window.open(`/jobs/${id}/`)
    }

    useEffect(() => {
        if (props.searchData?.length === 0){
            setNoJobStatus(<p>No jobs match your keyword at the moment.</p>)
        } else if (allJobsData.length === 0){
            setNoJobStatus(<p>No jobs posted at the moment.</p>)
        } else{
            setNoJobStatus()
        }
    }, [props.searchData])

    useEffect(() => {
        setResetPage(true)
        setTimeout(() => {
          setResetPage(false)
        }, 1)
    }, [props.paginationReset])

    
  return (
    <>
        { skeletonActive ?
        <UserJobSkeleton />
    :
        <div className={props.filterClicked ? "container-jobs-list-75vw" : 'container-jobs-list'} >
            <div className='jobs-list'>
            {props.searchData ? 
                props.searchData.length > 0 ?
                    props.searchData.map((item, index) => {
                        return (
                            <div id="job-card" key={item.id}>
                                <div className='user-image-name'>
                                    <div className='user-image'>
                                        <img className='user-image' src={item.user_profile_picture} />
                                    </div>
                                    <div className='user-name'>
                                        <Link to={`/jobs/${item.id}/`}>
                                            <h3>{item.job_title}</h3>
                                        </Link>
                                        <Link to={`/profile/company/?id=${item.user_posted.id}`} >
                                            <span>{item.user_posted.name}</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="user-info-skill-container" onMouseEnter={() => onMouseHover(index)} onMouseLeave={() => onMouseLeaveHover()}>
                                    <div className='user-info' >
                                    {isHover === index &&
                                        <div className='user-card-button'>
                                            <Button clickedButton={() => onClickInterest(item.id)} buttonType="button" label={isSendingInterest ? "Sending ..." :"Interested"}/>
                                            <Button clickedButton={() => onDetailClicked(item.id)} buttonType="button" label="Detail"/>
                                        </div> 
                                    }
                                        <ul>
                                            <li>
                                                <LocationOnIcon className='icon-user-list'  />
                                                {item?.joblocation.slice(0, 2).map((loc, i) => (
                                                    <span key={loc.location.id}>{loc.location.location}
                                                    {i < item?.joblocation.slice(0, 2).length-1 && <span>&nbsp;/</span>}
                                                    </span>
                                                    
                                                ))}
                                            </li>
                                            <li>
                                                <AttachMoneyIcon /><span>{item.jobsalaryrates.nominal} / {item.jobsalaryrates.paid_period}</span>
                                            </li>
                                            <li>
                                                <PsychologyIcon /><span>{item.experience_level}</span>
                                            </li>
                                            <li>
                                                <AccessTimeIcon /> 
                                                {item.jobemploymenttype.slice(0, 3).map((type, index) => {
                                                    return (
                                                    <React.Fragment key={index}>
                                                        <span>{type.employment_type.type}</span>
                                                        {index < item.jobemploymenttype.slice(0, 3).length - 1 && <span>/</span>}
                                                    </React.Fragment>
                                                    )
                                                })}
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='user-skills'>
                                        <li className='user-skills-list'>
                                            <ul>
                                                {item?.jobskills.slice(0, 3).map((item, i) => (
                                                    <li key={i}>{item.skill?.skill_name}</li>
                                                ))}
                                            </ul>
                                        </li>
                                    </div>
                                    <div className='job-list-deadline'>
                                        <p>Apply before: {format(new Date(item.deadline), 'MM-dd-yyyy')}</p>
                                    </div>
                                </div>
                            </div>
                        )} 
                    )
                    :
                    <p>{noJobStatus}</p>
            :
            allJobsData.length > 0 ?
                allJobsData.map((item, index) => {
                    return (
                        <div id="job-card" key={item.id}>
                            <div className='user-image-name'>
                                <div className='user-image'>
                                    <img className='user-image' src={item.user_profile_picture} />
                                </div>
                                <div className='user-name'>
                                    <Link to={`/jobs/${item.id}/`}>
                                        <h3>{item.job_title}</h3>
                                    </Link>
                                    <Link to={`/profile/company/?id=${item.user_posted.id}`} >
                                        <span>{item.user_posted.name}</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="user-info-skill-container" onMouseEnter={() => onMouseHover(index)} onMouseLeave={() => onMouseLeaveHover()}>
                                <div className='user-info' >
                                {isHover === index &&
                                    <div className='user-card-button'>
                                        <Button clickedButton={() => onClickInterest(item.id)} buttonType="button" label={isSendingInterest ? "Sending ..." :"Interested"}/>
                                        <Button clickedButton={() => onDetailClicked(item.id)} buttonType="button" label="Detail"/>
                                    </div> 
                                }
                                    <ul>
                                        <li>
                                            <LocationOnIcon className='icon-user-list'  />
                                            {item?.joblocation.slice(0, 2).map((loc, i) => (
                                                <span key={loc.location.id}>{loc.location.location}
                                                {i < item?.joblocation.slice(0, 2).length-1 && <span>&nbsp;/</span>}
                                                </span>
                                                
                                            ))}
                                        </li>
                                        <li>
                                            <AttachMoneyIcon /><span>{item.jobsalaryrates.nominal} / {item.jobsalaryrates.paid_period}</span>
                                        </li>
                                        <li>
                                            <PsychologyIcon /><span>{item.experience_level}</span>
                                        </li>
                                        <li>
                                            <AccessTimeIcon /> 
                                            {item.jobemploymenttype.slice(0, 3).map((type, index) => {
                                                return (
                                                <React.Fragment key={index}>
                                                    <span>{type.employment_type.type}</span>
                                                    {index < item.jobemploymenttype.slice(0, 3).length - 1 && <span>/</span>}
                                                </React.Fragment>
                                                )
                                            })}
                                        </li>
                                    </ul>
                                </div>
                                <div className='user-skills'>
                                    <li className='user-skills-list'>
                                        <ul>
                                            {item?.jobskills.slice(0, 3).map((item, i) => (
                                                <li key={i}>{item.skill?.skill_name}</li>
                                            ))}
                                        </ul>
                                    </li>
                                </div>
                                <div className='job-list-deadline'>
                                    <p>Apply before: {format(new Date(item.deadline), 'MM-dd-yyyy')}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
                :
                <p>{noJobStatus}</p>
            }
            
            </div>
            <div className='container-pagination'>
                <Pagination
                    type= {props.searchData ? "jobSearchList" : "allJobList"}
                    totalData={props.searchData ? props.totalUser : totalJobPosted.current}
                    loadJobList={onLoadAllJobs}
                    loadJobSearchList={props.loadJobSearch}
                    paginationReset={resetPage}
                />
            </div>
            {isNotLogin && 
                <NotLoginAction 
                    boxTitle="Interested? Please use Work Match account."
                    boxTagline="Build your profile, apply to this job with a free Work Match account."
                    close={onCloseIsNotLogin}     
                />
            }
            {backdropActive && <Backdrop />}
            {alertResponse && <AlertNotification alertData={alertResponse}/>}
        </div>
        }
    </>
  )
}

export default JobsList