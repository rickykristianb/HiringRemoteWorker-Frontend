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
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

const JobsList = (props) => {

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
    const [searchBarData, setSearchBarData] = useState([])

    let totalJobPosted = useRef(1)

    const onLoadAllJobs = async(page) => {
        let endPoint;
        try{
            setBackdropActive(true)
            if (!page){
                page = 1
            } else{
                page = page["page"]
            }

            const headers = {
                "content-type": "application/json"
            };    

            if (user) {
                endPoint = `/api/job/get_all_jobs_with_saved_by_user/?page=${page}`
                headers.Authorization = `JWT ${userToken}`
            } else {
                endPoint = `/api/job/get_all_job/?page=${page}`
            }

            const response = await fetch(endPoint, {
                method: "GET",
                headers: headers
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
        setSearchBarData(props.searchData)
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

    const handleSaveJob = async (id, setSearchData = false) => {
        console.log(searchBarData);
        if (!user) {
            return setIsNotLogin(true);
        }
        try {
            const response = await fetch(`/api/job/save_job/`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userToken}`
                },
                body: JSON.stringify({ id })
            });
            const data = await response.json();
            if (response.ok) {
                const updatedJobsData = (setSearchData ? searchBarData : allJobsData).map(item => {
                    if (item.id === id) {
                        return { ...item, saved_status: 302 };
                    }
                    return item;
                });
                (setSearchData ? setSearchBarData(updatedJobsData) : setAllJobsData(updatedJobsData));
                setAlertResponse({ "success": data["success"] });
            } else {
                setAlertResponse({ "error": data["error"] + " from another page. Please refresh" });
            }
        } catch (error) {
            setAlertResponse({ "error": error });
        }
    };

    const handleDeleteSavedJob = async (id, setSearchData = false) => {
        const response = await fetch(`/api/job/delete_saved_job/${id}/`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            const updatedJobsData = (setSearchData ? searchBarData : allJobsData).map(item => {
                if (item.id === id) {
                    return { ...item, saved_status: 500 };
                }
                return item;
            });
            (setSearchData ? setSearchBarData(updatedJobsData) : setAllJobsData(updatedJobsData));
            setAlertResponse({ "success": data["success"] });
        } else {
            setAlertResponse({ "error": data["error"] + " from another page. Please refresh" });
        }
    };

    
  return (
    <>
        { skeletonActive ?
        <UserJobSkeleton filterClicked={props.filterClicked} />
    :
        <div>
            <div className={props.filterClicked ? 'flex justify-center items-center flex-wrap gap-10 mt-10 md:mt-10 max-lg:mt-0 max-sm:mt-10' : 'flex justify-center flex-wrap gap-10 mt-10 md:mt-10 max-lg:mt-0 max-sm:mt-10'}>
            {searchBarData ? 
                searchBarData.length > 0 ?
                    searchBarData.map((item, index) => {
                        return (
                            <div className='card-container flex flex-col' key={item.id}>
                                <div className='self-end absolute mr-2 mt-2 cursor-pointer'>
                                {console.log(item)}
                                    {item.saved_status === 302 
                                    ?
                                        <BookmarkAddedIcon onClick={() => handleDeleteSavedJob(item.id, true)}  sx={{width: "30px", height: "30px"}} className='text-bookmark-saved-button hover:w-[33px] hover:h-[33px]' />
                                    :
                                        <BookmarkAddIcon onClick={() => handleSaveJob(item.id, true)} sx={{width: "30px", height: "30px"}} className='hover:w-[33px] hover:h-[33px]' />
                                    }
                                </div>
                                <div className='grid grid-cols-3 gap-4 m-5 h-[110]'>
                                    <div className='bg-white col-start-1 rounded-full w-[100px] h-[100px] flex justify-center'>
                                        <img className='bg-white rounded-full w-full h-full flex justify-center' src={item.user_profile_picture} />
                                    </div>
                                    <div className='flex col-span-2 flex-col gap-4 justify-center'>
                                        <Link to={`/jobs/${item.id}/`}>
                                            <h3 className='text-xl font-bold'>{item.job_title}</h3>
                                        </Link>
                                        <Link to={`/profile/company/?id=${item.user_posted.id}`} >
                                            <span>{item.user_posted.name}</span>
                                        </Link>
                                    </div>
                                </div>
                                <div onMouseEnter={() => onMouseHover(index)} onMouseLeave={() => onMouseLeaveHover()}>
                                    <div className='bg-white flex' >
                                    {isHover === index &&
                                        <div className='flex justify-center items-center gap-10 z-1 w-[350px] h-[204px] absolute' 
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
                                            }} 
                                        >
                                            <Button clickedButton={() => onClickInterest(item.id)} buttonType="button" label={isSendingInterest ? "Sending ..." :"Interested"}/>
                                            <Button clickedButton={() => onDetailClicked(item.id)} buttonType="button" label="Detail"/>
                                        </div> 
                                    }
                                        <ul className='flex flex-col gap-2 pl-5 mt-5'>
                                            <li className='flex gap-3'>
                                                <LocationOnIcon className='content-end' />
                                                {item?.joblocation.slice(0, 2).map((loc, i) => (
                                                    <span key={loc.location.id}>{loc.location.location}
                                                    {i < item?.joblocation.slice(0, 2).length-1 && <span>&nbsp;/</span>}
                                                    </span>
                                                    
                                                ))}
                                            </li>
                                            <li className='flex gap-3'>
                                                <AttachMoneyIcon /><span>{item.jobsalaryrates.nominal} / {item.jobsalaryrates.paid_period}</span>
                                            </li>
                                            <li className='flex gap-3'>
                                                <PsychologyIcon /><span>{item.experience_level}</span>
                                            </li>
                                            <li className='flex gap-3'>
                                                <AccessTimeIcon /> 
                                                {item.jobemploymenttype.slice(0, 3).map((type, index) => {
                                                    return (
                                                    <React.Fragment key={index}>
                                                        <span className='self-end'>{type.employment_type.type}</span>
                                                        {index < item.jobemploymenttype.slice(0, 3).length - 1 && <span>/</span>}
                                                    </React.Fragment>
                                                    )
                                                })}
                                            </li>
                                        </ul>
                                    </div>
                                    <div className='bg-white'>
                                        <li>
                                            <ul className='flex justify-center flex-wrap pt-2 mt-0 gap-3 mb-0'>
                                                {item?.jobskills.slice(0, 3).map((item, i) => (
                                                    <li className='p-[10px] bg-soft-basic rounded-lg mb-3' key={i}>{item.skill?.skill_name}</li>
                                                ))}
                                            </ul>
                                        </li>
                                    </div>
                                    <div className='flex justify-start items-center bg-soft-basic h-[30px] rounded-[0_0_10px_10px]'>
                                        <p className='m-0 p-0 pl-5 text-md'>Apply before: {format(new Date(item.deadline), 'MM-dd-yyyy')}</p>
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
                        <div className='card-container flex flex-col' key={item.id}>
                            <div className='self-end absolute mr-2 mt-2 cursor-pointer'>
                                {item.saved_status === 302 
                                ?
                                    <BookmarkAddedIcon onClick={() => handleDeleteSavedJob(item.id)}  sx={{width: "30px", height: "30px"}} className='text-bookmark-saved-button hover:w-[33px] hover:h-[33px]' />
                                :
                                    <BookmarkAddIcon onClick={() => handleSaveJob(item.id)} sx={{width: "30px", height: "30px"}} className='hover:w-[33px] hover:h-[33px]' />
                                }
                            </div>
                            <div className='grid grid-cols-3 gap-4 m-5 h-[110]'>
                                <div className='bg-white col-start-1 rounded-full w-[100px] h-[100px] flex justify-center'>
                                    <img className='bg-white rounded-full w-full h-full flex justify-center' src={item.user_profile_picture} />
                                </div>
                                <div className='flex col-span-2 flex-col gap-4 justify-center'>
                                    <Link to={`/jobs/${item.id}/`}>
                                        <h3 className='text-xl font-bold'>{item.job_title}</h3>
                                    </Link>
                                    <Link to={`/profile/company/?id=${item.user_posted.id}`} >
                                        <span>{item.user_posted.name}</span>
                                    </Link>
                                </div>
                            </div>
                            <div onMouseEnter={() => onMouseHover(index)} onMouseLeave={() => onMouseLeaveHover()}>
                                <div className='bg-white flex' >
                                {isHover === index &&
                                    <div className='flex justify-center items-center gap-10 z-1 w-[350px] h-[204px] absolute' 
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
                                        }}
                                    >
                                        <Button clickedButton={() => onClickInterest(item.id)} buttonType="button" label={isSendingInterest ? "Sending ..." :"Interested"}/>
                                        <Button clickedButton={() => onDetailClicked(item.id)} buttonType="button" label="Detail"/>
                                    </div> 
                                }
                                    <ul className='flex flex-col gap-2 pl-5 mt-5'>
                                        <li className='flex gap-3'>
                                            <LocationOnIcon className='content-end' />
                                            {item?.joblocation.slice(0, 2).map((loc, i) => (
                                                <span key={loc.location.id}>{loc.location.location}
                                                {i < item?.joblocation.slice(0, 2).length-1 && <span>&nbsp;/</span>}
                                                </span>
                                                
                                            ))}
                                        </li>
                                        <li className='flex gap-3'>
                                            <AttachMoneyIcon /><span>{item.jobsalaryrates.nominal} / {item.jobsalaryrates.paid_period}</span>
                                        </li>
                                        <li className='flex gap-3'>
                                            <PsychologyIcon /><span>{item.experience_level}</span>
                                        </li>
                                        <li className='flex gap-3'>
                                            <AccessTimeIcon /> 
                                            {item.jobemploymenttype.slice(0, 3).map((type, index) => {
                                                return (
                                                <React.Fragment key={index}>
                                                    <span className='self-end'>{type.employment_type.type}</span>
                                                    {index < item.jobemploymenttype.slice(0, 3).length - 1 && <span>/</span>}
                                                </React.Fragment>
                                                )
                                            })}
                                        </li>
                                    </ul>
                                </div>
                                <div className='bg-white'>
                                    <li>
                                        <ul className='flex justify-center flex-wrap pt-2 mt-0 gap-3 mb-0'>
                                            {item?.jobskills.slice(0, 3).map((item, i) => (
                                                <li className='p-[10px] bg-soft-basic rounded-lg mb-3' key={i}>{item.skill?.skill_name}</li>
                                            ))}
                                        </ul>
                                    </li>
                                </div>
                                <div className='flex justify-start items-center bg-soft-basic h-[30px] rounded-[0_0_10px_10px]'>
                                    <p className='m-0 p-0 pl-5 text-md'>Apply before: {format(new Date(item.deadline), 'MM-dd-yyyy')}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
                :
                <p>{noJobStatus}</p>
            }
            </div>
            <div className='my-12 flex justify-center'>
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