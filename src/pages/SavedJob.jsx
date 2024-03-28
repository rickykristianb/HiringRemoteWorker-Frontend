import AuthContext from 'Context/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import SavedJobDetail from 'components/SavedJobDetail'
import { Link } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import Button from 'components/Button';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import AlertNotification from 'components/AlertNotification';

const SavedJob = () => {

    const [userSavedJobs, setUserSavedJobs] = useState([])
    const [isClicked, setIsClicked] = useState()
    const [jobIdClicked, setJobIdClicked] = useState()
    const [alertResponse, setAlertResponse] = useState()

    const { authToken} = useContext(AuthContext)
    const { access:userToken } = authToken

    useEffect(() => {
        const onLoadUserSavedJob = async() => {
            const response = await fetch(`/api/job/get_all_user_saved_job/`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `JWT ${userToken}`
                }
            });
            const data = await response.json()
            if (response.ok){
                setUserSavedJobs(data)
                setIsClicked(data[0]?.job)
                setJobIdClicked(data[0]?.job)
            }
        }
        onLoadUserSavedJob()
    }, [])

    const onClickSavedJob = (id) => {
        setIsClicked(id)
        setJobIdClicked(id)
    }

    const onRemoveAllSavedJob = async() => {
        const response = await fetch(`/api/job/remove_all_user_saved_jobs/`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "Authorization": `JWT ${userToken}`
            }
        });
        const data = await response.json()
        if (response.ok){
            setUserSavedJobs([])
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
            removeSavedJobFromList(id)
            setAlertResponse({"success": data["success"]})
        } else {
            setAlertResponse({"error": data["error"]})
        }
    }

    const removeSavedJobFromList = (id) => {
        setUserSavedJobs((prevUserSavedJobs) => {
            const filteredJobList = prevUserSavedJobs.filter((item, index) => item.user_posted.job_id !== id)
            return filteredJobList
        })
    }

    useEffect(() => {
        setIsClicked(userSavedJobs[0]?.user_posted.job_id)
        setJobIdClicked(userSavedJobs[0]?.user_posted.job_id)
    }, [userSavedJobs])



  return (
    <div className='flex justify-center items-center'>
        {userSavedJobs.length > 0 ?
        <div className='flex justify-center w-full mx-40 my-10 max-sm:mt-20 p-4 max-sm:p-0 pt-0 pl-0 rounded-lg shadow-box-shadow'>
            <div className='w-[400px] flex flex-col '>
                <div className='flex justify-between items-center h-10 text-lg font-bold bg-soft-basic px-2'>
                    <p>Saved Job<span>{userSavedJobs.length > 1 && "s"}</span> <span>({userSavedJobs.length})</span></p>
                    <div className='flex items-center cursor-pointer' onClick={onRemoveAllSavedJob}>
                        <CloseIcon />
                        <p>Remove All</p>
                    </div>
                </div>
                {userSavedJobs.map((item, index) => {
                    return (
                        <div key={item.id} className={`flex flex-col gap-2 p-2 border-1.5 border-r-0 ${isClicked === item.user_posted.job_id && "border-l-6 border-l-dark-basic"} px-2 py-6 cursor-pointer`} onClick={() => onClickSavedJob(item.user_posted.job_id)}>
                            <div className='self-end absolute' onClick={() => deleteSavedJob(item.user_posted.job_id)}>
                                <BookmarkAddedIcon  sx={{width: "30px", height: "30px"}} className='text-bookmark-saved-button hover:w-[33px] hover:h-[33px]' />
                            </div>
                            <div className='flex gap-2'>
                                <div className='w-[60px] h-[60px] rounded-lg bg-dark-basic'>
                                    <img src={item.user_profile_picture} alt='user-picture' className='w-[60px] h-[60px] rounded-lg' />
                                </div>
                                <div className='w-full'>
                                    <p className='text-lg font-bold mb-4'>{item.user_posted.job_title}</p>
                                    <Link to={`/profile/company/?id=${item.user_posted.user_posted_id}`} >
                                        <p className='mb-2 hover:underline'>{item.user_posted.user_posted_name}</p>
                                    </Link>
                                    
                                    <div className='flex justify-between'>
                                        <p><span id={(() => {
                                            switch(item.user_posted.job_status){
                                            case "Open":
                                                return "job-status-open"
                                            case "Closed":
                                                return "job-status-closed"
                                            case "Onprogress":
                                                return "job-status-onprogress"
                                            case "Finished":
                                                return "job-status-finished"
                                            }
                                        })()}>{item.user_posted.job_status}</span></p>
                                        <p className='text-[14px] text-slate-400'>Apply before: {item.user_posted.job_deadline}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>
            <div className=' w-[980px] max-sm:hidden border-l-1.5 py-4'>
                <SavedJobDetail jobId={jobIdClicked} unSaved={removeSavedJobFromList} />
            </div>
        </div>
        :
            <div className='h-screen w-screen flex justify-center mt-10 max-sm:mt-24'>
                <div className='flex flex-col gap-4 justify-center items-center text-lg w-[80%] h-[20%] rounded-lg shadow-box-shadow'>
                    <p>You haven't saved any jobs</p>
                    <Button buttonType="button" label="Browse Job Board" />
                </div>
            </div>
        }
        {alertResponse && <AlertNotification alertData={alertResponse}/>}
    </div>
  )
}

export default SavedJob